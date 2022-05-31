import asyncio
from time import time
from typing import List
from aiohttp import ClientSession
from .routes import Routes
from protocol.subscriptions import Subscriptions
from .bus import Bus


class Positions:
    routes: Routes
    buses: List[Bus]
    json_buses: list

    loop: asyncio.AbstractEventLoop
    lock: asyncio.Lock
    subscriptions: Subscriptions

    def __init__(self, routes: Routes, loop: asyncio.AbstractEventLoop):
        if len(routes.routes) == 0:
            raise Exception("Can't start parsing with empty routes")
        self.routes = routes
        self.loop = loop or asyncio.get_running_loop()
        self.lock = asyncio.Lock(loop=self.loop)
        self.subscriptions = Subscriptions()

        self.buses = []
        self.json_buses = []

    async def get_buses_on_route(self, route: int) -> List[Bus]:
        url = "http://www.map.gptperm.ru/json/get-moving-autos/-%02d-?_=%d" % (route, int(time()))

        async with ClientSession(loop=self.loop) as session:
            async with session.get(url) as response:
                data = await response.json()
                return [Bus(**auto) for auto in data["autos"]]

    async def parse(self):
        # парсим api спермо транса по всем маршрутам
        tasks = [
            self.loop.create_task(self.get_buses_on_route(route))
            for route in self.routes.routes
        ]
        result, _ = await asyncio.wait(tasks)

        async with self.lock:  # записываем результаты
            self.buses = []
            for task in result:
                self.buses += task.result()
            self.json_buses = [bus.json() for bus in self.buses]

        await self.subscriptions.publish(self.loop)

    async def scheduler(self):
        while True:
            await self.parse()
            await asyncio.sleep(15)
