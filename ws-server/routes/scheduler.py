import asyncio
from .routes import Routes
from .positions import Positions
from protocol.subscriptions import Subscriptions


class Scheduler:
    routes: Routes
    positions: Positions

    loop: asyncio.AbstractEventLoop
    lock: asyncio.Lock
    subscriptions: Subscriptions

    def __init__(self, loop: asyncio.AbstractEventLoop):
        self.loop = loop or asyncio.get_running_loop()
        self.lock = asyncio.Lock()

        self.routes = Routes(loop=self.loop)
        self.positions = Positions(self.routes, lock=self.lock, loop=self.loop)
        self.subscriptions = Subscriptions(loop=self.loop)

    async def update(self):
        await self.positions.update()
        await self.subscriptions.publish()

    async def schedule(self):
        await self.routes.get_routes()
        while True:
            await self.update()
            await asyncio.sleep(15)
