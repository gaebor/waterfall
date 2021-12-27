import json
import argparse
import re

from termcolor import colored

import tornado.ioloop
import tornado.gen
from tornado.websocket import websocket_connect


class ParseKwargs(argparse.Action):
    def __call__(self, parser, namespace, values, option_string=None):
        setattr(namespace, self.dest, dict())
        for value in values:
            key, value = value.split('=')
            getattr(namespace, self.dest)[key] = int(value)


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


def print_line(message, factors, width=20):
    for pattern, factor in factors.items():
        for values in message:
            if re.fullmatch(pattern, values[0]) is not None:
                text = values[0]
                if len(values) > 3:
                    text = values[3]
                print_bar(
                    text, width * values[1] / factor, width * values[2] / factor, total_width=width
                )
    print('', flush=True)


def get_args():
    parser = argparse.ArgumentParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument('--url', default='ws://localhost:8888/waterfall', help=' ')
    parser.add_argument('--width', default=20, help=' ', type=int)

    parser.add_argument(
        '--factors',
        nargs='+',
        action=ParseKwargs,
        help='`item=factor` pairs',
        default={'cpu\\d+': 100, 'memory': 100},
    )
    return parser.parse_args()


def main():
    args = get_args()

    @tornado.gen.coroutine
    def run():
        connection = yield websocket_connect(args.url)
        while True:
            msg = yield connection.read_message()
            if msg is None:
                break
            print_line(json.loads(msg), args.factors, width=args.width)

    run()
    tornado.ioloop.IOLoop.current().start()


if __name__ == "__main__":
    main()
