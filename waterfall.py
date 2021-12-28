import json
import argparse
import re

from termcolor import colored

import tornado.ioloop
import tornado.gen
from tornado.websocket import websocket_connect


def get_args():
    parser = argparse.ArgumentParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument('--url', default='ws://localhost:8888/waterfall', help=' ')
    parser.add_argument('--width', default=20, help=' ', type=int)
    parser.add_argument(
        'descriptors',
        nargs="*",
        type=str,
        default=['.*', '100', '10'],
        help='pattern [factor [width]] [pattern [factor [width]]] ... where `pattern` is a regex, `factor` is an float and `width` is an integer',
    )
    args = parser.parse_args()
    args.descriptors = parse_column_descriptors(args.descriptors, args.width)
    return args


def text_cap(s, width):
    if width == 0:
        return ''
    return f'{s[:width]:{width}s}'


def print_bar(text, highlight1_width, highlight2_width=0, total_width=80):
    total_width = int(max(0, total_width))
    highlight1_width = int(min(highlight1_width, total_width))
    highlight2_width = int(min(highlight2_width, total_width - highlight1_width))
    part1 = (
        colored(text_cap(text, highlight1_width), attrs=['reverse'])
        if highlight1_width > 0
        else ''
    )
    part2 = (
        colored(
            text_cap(text[highlight1_width:], highlight2_width),
            on_color='on_red',
        )
        if highlight2_width > 0
        else ''
    )
    part3 = text_cap(
        text[highlight1_width + highlight2_width :],
        total_width - (highlight1_width + highlight2_width),
    )

    print(part1 + part2 + part3, end='')


def print_line(message, descriptors):
    for pattern, description in descriptors.items():
        relevant_messages = filter(
            lambda values: re.fullmatch(pattern, values[0]) is not None, message
        )
        for values in relevant_messages:
            text = values[0]
            if len(values) > 3:
                text = values[3]
            factor = description['width'] / description['factor']
            print_bar(
                text, factor * values[1], factor * values[2], total_width=description['width']
            )
    print('', flush=True)


def parse_column_descriptors(argv, default_width):
    column_descriptors = {}
    i = 0
    while i < len(argv):
        pattern = argv[i]
        i += 1
        column_descriptors[pattern] = {'factor': 100, 'width': default_width}
        try:
            value = float(argv[i])
        except ValueError:
            pass
        except IndexError:
            pass
        else:
            column_descriptors[pattern]['factor'] = value
            i += 1

        try:
            value = int(argv[i])
        except ValueError:
            pass
        except IndexError:
            pass
        else:
            column_descriptors[pattern]['width'] = value
            i += 1

    return column_descriptors


def main():
    args = get_args()

    @tornado.gen.coroutine
    def run():
        connection = yield websocket_connect(args.url)
        while True:
            msg = yield connection.read_message()
            if msg is None:
                break
            print_line(json.loads(msg), args.descriptors)

    run()
    tornado.ioloop.IOLoop.current().start()


if __name__ == "__main__":
    main()
