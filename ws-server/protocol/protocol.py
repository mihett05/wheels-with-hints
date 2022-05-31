import json
from typing import Tuple
from websockets.server import WebSocketServerProtocol
from routes.positions import Positions


class Protocol:
    coords: Tuple[float, float]
    size: Tuple[float, float]

    ws: WebSocketServerProtocol

    def __init__(self, ws: WebSocketServerProtocol, positions: Positions):
        self.ws = ws
        self.positions = positions
        self.coords = (0, 0)
        self.size = (0, 0)

    async def send(self, data: dict):
        await self.ws.send(json.dumps(data).encode("utf-8"))

    async def send_error(self):
        await self.send({
            "action": "error",
            "data": {
                "message": "invalid request"
            }
        })

    async def update_cb(self):
        await self.send({
            "action": "update",
            "data": self.positions.json_buses
        })

    async def process(self):
        self.positions.subscriptions.subscribe(self.ws, self.update_cb)
        await self.update_cb()  # отправляем актуальные данные по автобусам при подключении
        async for raw_msg in self.ws:
            try:
                msg = json.loads(raw_msg)
                if "action" not in msg:
                    await self.send_error()
                elif msg["action"] == "change_screen":
                    self.coords = (msg["data"]["coords"][0], msg["data"]["coords"][1])
                    self.size = (msg["data"]["size"][0], msg["data"]["size"][1])
            except json.JSONDecodeError:
                await self.send_error()