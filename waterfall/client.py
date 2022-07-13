import json
import argparse

import tornado.ioloop
import tornado.gen
from tornado.websocket import websocket_connect

from waterfall import print_line, parse_column_descriptors


def get_args():
    parser = argparse.ArgumentParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument('--port', default=8888, help=' ', type=int)
    parser.add_argument('--hostname', default='localhost', help=' ')
    parser.add_argument('--url', help=' ')
    parser.add_argument('--width', default=20, help=' ', type=int)
    parser.add_argument(
        '--descriptors',
        nargs="*",
        type=str,
        default=['.*', '100', '10'],
        help='pattern [factor [width]] [pattern [factor [width]]] ... where `pattern` is a regex, `factor` is an float and `width` is an integer',
    )
    args = parser.parse_args()
    args.descriptors = parse_column_descriptors(args.descriptors, args.width)
    return args


def main():
    args = get_args()

    if args.url is None:
        args.url = f'ws://{args.hostname}:{args.port}/waterfall'

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
