import asyncio
from typing import List, Optional
from aiohttp import ClientSession
from bs4 import BeautifulSoup


class Routes:
    ROUTER_URL = "https://gortransperm.ru/2179/2188"

    routes: List[int]
    loop: asyncio.AbstractEventLoop

    def __init__(self, loop: Optional[asyncio.AbstractEventLoop] = None):
        self.routes = []
        self.loop = loop or asyncio.get_running_loop()

    def parse_table(self, text: str):
        soup = BeautifulSoup(text, features="html.parser")
        for row in soup.select_one("table").select("tr"):
            num = row.select("td")[0].get_text().strip()
            if num.isdigit():
                self.routes.append(int(num))

    async def get_routes(self):
        async with ClientSession(loop=self.loop) as session:
            async with session.get(self.ROUTER_URL) as response:
                self.parse_table(await response.text())
