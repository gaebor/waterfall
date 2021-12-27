import logging

import tornado.escape
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.websocket

import providers


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
        logging.info("sending message to %d waiters", len(cls.waiters))
        for waiter in cls.waiters:
            try:
                waiter.write_message(payload)
            except:
                logging.error("Error sending message", exc_info=True)


class TimedFunction:
    def __init__(self):
        self.update_stats()

    def update_stats(self):
        return providers.all()

    def run(self):
        StatsServer.send_updates(tornado.escape.json_encode(self.update_stats()))


def main():
    tornado.options.define("port", default=8888, help="run on the given port", type=int)
    tornado.options.define(
        "refresh", default=5000, help="refresh interval in milliseconds", type=int
    )

    tornado.options.parse_command_line()
    app = Application()
    app.listen(tornado.options.options.port)
    loop = tornado.ioloop.IOLoop.current()
    timer = TimedFunction()
    tornado.ioloop.PeriodicCallback(timer.run, tornado.options.options.refresh).start()
    loop.start()


if __name__ == "__main__":
    main()
