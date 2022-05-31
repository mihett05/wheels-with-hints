import asyncio
from websockets.server import WebSocketServerProtocol, serve

from routes.scheduler import Scheduler
from protocol.protocol import Protocol


loop = asyncio.new_event_loop()
asyncio.set_event_loop(loop)
scheduler: Scheduler = Scheduler(loop)


async def ws_server(ws: WebSocketServerProtocol):
    protocol = Protocol(ws, scheduler)
    await protocol.process()


async def main():
    async with serve(ws_server, "localhost", 8080, loop=loop):
        await asyncio.Future()


if __name__ == '__main__':
    loop.create_task(scheduler.schedule())
    loop.run_until_complete(main())
