import asyncio
import sys
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
    ip = "localhost" if len(sys.argv) < 2 else sys.argv[1]
    port = 8080 if len(sys.argv) < 3 else int(sys.argv[2])
    async with serve(ws_server, ip, port, loop=loop):
        print(f"Server is running on ws://{ip}:{port}")
        await asyncio.Future()


if __name__ == '__main__':
    loop.create_task(scheduler.schedule())
    loop.run_until_complete(main())
