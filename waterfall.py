import sys
from threading import Thread
from itertools import chain
import os.path
import uuid
import logging
from time import time

import tornado.escape
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.websocket
from tornado.options import define, options

define("port", default=8888, help="run on the given port", type=int)
define("refresh", default=2000, help="refresh interval in milliseconds", type=int)

import providers


class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/websocket", WebSocketHandler),
            (
                r"/(.*)",
                tornado.web.StaticFileHandler,
                {'path': os.path.dirname(__file__), 'default_filename': "index.html"},
            ),
        ]
        super().__init__(handlers)


class WebSocketHandler(tornado.websocket.WebSocketHandler):
    waiters = set()

    def check_origin(self, origin):
        return True

    def get_compression_options(self):
        # Non-None enables compression with default options.
        return {}

    def open(self):
        WebSocketHandler.waiters.add(self)
        # TODO send total memory, ncpus, hostname?

    def on_close(self):
        WebSocketHandler.waiters.remove(self)

    @classmethod
    def send_updates(cls, chat):
        logging.info("sending message to %d waiters", len(cls.waiters))
        for waiter in cls.waiters:
            try:
                waiter.write_message(chat)
            except:
                logging.error("Error sending message", exc_info=True)


class CmdReader(Thread):
    def __init__(self, loop):
        self.loop = loop
        super().__init__()

    def run(self):
        for line in sys.stdin:
            self.loop.add_callback(WebSocketHandler.send_updates, line.strip())


class TimedFunction:
    def __init__(self):
        self.current = None
        self.current_time = None
        self.update_stats()
        self.previous_time = self.current_time
        self.previous = self.current

    def update_stats(self):
        self.previous_time = self.current_time
        self.previous = self.current

        self.current = list(chain(providers.cpu(), providers.disk(), providers.net()))
        self.current_time = time()

    def get_diff_stats(self):
        dt = self.current_time - self.previous_time
        return [
            (
                self.current[i][0],
                (self.current[i][1] - self.previous[i][1]) / dt,
                (self.current[i][2] - self.previous[i][2]) / dt,
            )
            for i in range(len(self.current))
        ] + providers.memory()

    def run(self):
        self.update_stats()
        WebSocketHandler.send_updates(tornado.escape.json_encode(self.get_diff_stats()))


def main():
    tornado.options.parse_command_line()
    app = Application()
    app.listen(options.port)
    loop = tornado.ioloop.IOLoop.current()
    # CmdReader(loop).start()
    timer = TimedFunction()
    tornado.ioloop.PeriodicCallback(timer.run, options.refresh).start()
    loop.start()


if __name__ == "__main__":
    main()
