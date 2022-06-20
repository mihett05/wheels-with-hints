import asyncio
from time import time
from typing import List
from aiohttp import ClientSession, ClientError
from .routes import Routes
from .transport import Transport


class Positions:
    routes: Routes
    loop: asyncio.AbstractEventLoop
    lock: asyncio.Lock
    buses: List[Transport]
    trams: List[Transport]

    def __init__(self, routes: Routes, lock: asyncio.Lock, loop: asyncio.AbstractEventLoop = None):
        self.routes = routes
        self.lock = lock
        self.loop = loop or asyncio.get_running_loop()
        self.buses = []
        self.trams = []

    async def get_route(self, route: int) -> List[Transport]:
        url = "http://www.map.gptperm.ru/json/get-moving-autos/-%02d-?_=%d" % (route, int(time()))
        async with ClientSession(loop=self.loop) as session:
            async with session.get(url) as response:
                data = await response.json()
                return [Transport(**auto) for auto in data["autos"]]

    @staticmethod
    def filter_transport(transport: List[Transport]) -> List[Transport]:
        return list(filter(lambda x: x.lf, transport))

    async def update(self):
        # парсим api спермо транса по всем маршрутам
        tasks = {
            "buses": asyncio.gather(*[
                self.loop.create_task(self.get_route(route))
                for route in self.routes.buses
            ]),
            "trams": asyncio.gather(*[
                self.loop.create_task(self.get_route(800 + route))  # с 800 начинаются, ёб их маму, трамваи
                for route in self.routes.trams
            ])
        }

        try:
            await asyncio.gather(
                *tasks.values()
            )
        except ClientError as e:  # спермотранс порой выкидывает error
            print(e)
        else:
            async with self.lock:  # записываем результаты
                for key in tasks:
                    self.__setattr__(key, [])
                    for task in tasks[key].result():
                        self.__getattribute__(key).extend(
                            self.filter_transport(task)
                        )
