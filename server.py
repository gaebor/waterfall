from functools import partial
import argparse
from sys import stderr

import tornado.escape
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.websocket

import providers
from waterfall import parse_column_descriptors, print_line


def get_args():
    parser = argparse.ArgumentParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument('--port', default=8888, help=' ', type=int)
    parser.add_argument('--width', default=20, help=' ', type=int)
    parser.add_argument('--refresh', default=2000, help='milliseconds', type=int)
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


class Application(tornado.web.Application):
    def __init__(self):
        handlers = [(r"/waterfall", StatsServer)]
        super().__init__(handlers)


class StatsServer(tornado.websocket.WebSocketHandler):
    waiters = set()

    def check_origin(self, origin):
        return True

    def get_compression_options(self):
        # Non-None enables compression with default options.
        return {}

    def open(self):
        StatsServer.waiters.add(self)

    def on_close(self):
        StatsServer.waiters.remove(self)

    @classmethod
    def send_updates(cls, payload):
        for waiter in cls.waiters:

            try:
                waiter.write_message(payload)
            except tornado.websocket.WebSocketClosedError:
                print(f"Error sending message to {waiter}", exc_info=True, file=stderr)
            else:
                print(f"Message sent to {waiter}", file=stderr)


class TimedFunction:
    def __init__(self):
        self.update_stats()

    def update_stats(self):
        return providers.all()

    def run(self, descriptors):
        payload = self.update_stats()
        StatsServer.send_updates(tornado.escape.json_encode(payload))
        print_line(payload, descriptors)


def main():
    args = get_args()

    app = Application()
    app.listen(args.port)
    loop = tornado.ioloop.IOLoop.current()
    timer = TimedFunction()
    tornado.ioloop.PeriodicCallback(
        partial(timer.run, descriptors=args.descriptors), args.refresh
    ).start()
    loop.start()


if __name__ == "__main__":
    main()
