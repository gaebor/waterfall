import json

import tornado.options
import tornado.ioloop
import tornado.gen
from tornado.websocket import websocket_connect


@tornado.gen.coroutine
def run(url):
    connection = yield websocket_connect(url)
    while True:
        msg = yield connection.read_message()
        if msg is None:
            break
        print(json.loads(msg))


def main():
    tornado.options.define("url", default='ws://localhost:8888/waterfall', type=str)
    tornado.options.parse_command_line()

    run(tornado.options.options.url)
    tornado.ioloop.IOLoop.current().start()


if __name__ == "__main__":
    main()
