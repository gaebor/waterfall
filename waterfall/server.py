from argparse import ArgumentParser, ArgumentDefaultsHelpFormatter
from sys import stderr
from os.path import dirname

from tornado.escape import json_encode
from tornado.ioloop import IOLoop, PeriodicCallback
from tornado.web import Application, StaticFileHandler
from tornado.websocket import WebSocketHandler, WebSocketClosedError

from waterfall.providers import every as all_providers


def get_args():
    parser = ArgumentParser(formatter_class=ArgumentDefaultsHelpFormatter)
    parser.add_argument('--port', default=8888, help=' ', type=int)
    parser.add_argument('--refresh', default=2000, help='milliseconds', type=int)
    parser.add_argument(
        '--html',
        '--http',
        dest='html',
        default=False,
        help='hosts a static webpage as well',
        action='store_true',
    )
    args = parser.parse_args()
    return args


def make_application(enable_html):
    handlers = [(r"/waterfall", StatsServer)]
    if enable_html:
        handlers.append(
            (r"/(.*)", StaticFileHandler, {'path': '', 'default_filename': "index.html"})
        )
    return Application(handlers, static_path=dirname(__file__))


# pylint: disable=abstract-method
class StatsServer(WebSocketHandler):
    waiters = set()

    def check_origin(self, origin):
        return True

    def on_message(self, message):
        pass

    def get_compression_options(self):
        # Non-None enables compression with default options.
        return {}

    def open(self, *args: str, **kwargs: str):
        StatsServer.waiters.add(self)

    def on_close(self):
        StatsServer.waiters.remove(self)

    @classmethod
    def send_updates(cls, payload):
        for waiter in cls.waiters:

            try:
                waiter.write_message(payload)
            except WebSocketClosedError:
                print(f"Error sending message to {waiter}", exc_info=True, file=stderr)
            else:
                print(f"Message sent to {waiter}", file=stderr)


class TimedFunction:
    def __init__(self):
        self.update_stats()

    def update_stats(self):
        return all_providers()

    def run(self):
        payload = self.update_stats()
        StatsServer.send_updates(json_encode([metric.__dict__ for metric in payload]))


def main():
    args = get_args()

    app = make_application(args.html)
    app.listen(args.port)
    loop = IOLoop.current()
    timer = TimedFunction()
    PeriodicCallback(timer.run, args.refresh).start()
    loop.start()


if __name__ == "__main__":
    main()
