import asyncio
from websockets.server import WebSocketServerProtocol
from typing import Dict, Callable, Awaitable


CallbackType = Callable[[], Awaitable[None]]


class Subscriptions:
    subscriptions: Dict[WebSocketServerProtocol, CallbackType]
    loop: asyncio.AbstractEventLoop

    def __init__(self, loop: asyncio.AbstractEventLoop):
        self.loop = loop or asyncio.get_running_loop()
        self.subscriptions = dict()

    def subscribe(self, ws: WebSocketServerProtocol, cb: CallbackType):
        self.subscriptions[ws] = cb

    def unsubscribe(self, ws: WebSocketServerProtocol):
        if ws in self.subscriptions:
            self.subscriptions.pop(ws)

    def check_subscribers(self):
        keys = list(self.subscriptions.keys())
        for sub in keys:
            if sub in self.subscriptions and sub.closed:
                self.subscriptions.pop(sub)

    async def publish(self):
        self.check_subscribers()
        if self.subscriptions:
            tasks = [
                self.loop.create_task(sub())
                for sub in self.subscriptions.values()
            ]
            await asyncio.wait(tasks)
