import json
from typing import Tuple, List
from pydantic import BaseModel
from websockets.server import WebSocketServerProtocol
from routes.scheduler import Scheduler
from routes.transport import Transport


class Bounds(BaseModel):
    northEast: List[float]
    southWest: List[float]


class Protocol:
    bounds: Bounds

    ws: WebSocketServerProtocol
    scheduler: Scheduler

    def __init__(self, ws: WebSocketServerProtocol, scheduler: Scheduler):
        self.ws = ws
        self.scheduler = scheduler
        self.bounds = Bounds(northEast=[0, 0], southWest=[0, 0])

    async def send(self, data: dict):
        await self.ws.send(json.dumps(data).encode("utf-8"))

    async def send_error(self):
        await self.send({
            "action": "error",
            "data": {
                "message": "invalid request"
            }
        })

    def filter_transport(self, transports: List[Transport]):
        return [
            t.dict() for t in transports
            if all([
                (self.bounds.southWest[0] <= t.e <= self.bounds.northEast[0]),
                (self.bounds.southWest[1] <= t.n <= self.bounds.northEast[1])
            ])
        ]

    async def update_cb(self):
        await self.send({
            "action": "update",
            "data": {
                "buses": self.filter_transport(self.scheduler.positions.buses),
                "trams": self.filter_transport(self.scheduler.positions.trams)
            }
        })

    async def process(self):
        self.scheduler.subscriptions.subscribe(self.ws, self.update_cb)
        await self.update_cb()  # отправляем актуальные данные по автобусам при подключении
        async for raw_msg in self.ws:
            try:
                msg = json.loads(raw_msg)
                if "action" not in msg:
                    await self.send_error()
                elif msg["action"] == "change_bounds":
                    self.bounds = Bounds(**msg["data"])
                    await self.update_cb()
            except json.JSONDecodeError:
                await self.send_error()
