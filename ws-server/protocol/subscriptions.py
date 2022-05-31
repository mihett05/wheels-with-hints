import asyncio
from websockets.server import WebSocketServerProtocol
from typing import Dict, Callable, Awaitable


CallbackType = Callable[[], Awaitable[None]]


class Subscriptions:
    subscriptions: Dict[WebSocketServerProtocol, CallbackType]

    def __init__(self):
        self.subscriptions = dict()

    def subscribe(self, ws: WebSocketServerProtocol, cb: CallbackType):
        self.subscriptions[ws] = cb

    def unsubscribe(self, ws: WebSocketServerProtocol):
        if ws in self.subscriptions:
            self.subscriptions.pop(ws)

    def check_subscribers(self):
        for sub in self.subscriptions:
            if sub.closed:
                self.subscriptions.pop(sub)

    async def publish(self, loop: asyncio.AbstractEventLoop):
        self.check_subscribers()
        tasks = [
            loop.create_task(sub())
            for sub in self.subscriptions.values()
        ]
        await asyncio.wait(tasks)
