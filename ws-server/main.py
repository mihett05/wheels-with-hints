import asyncio
from websockets.server import WebSocketServerProtocol, serve

from routes.routes import Routes
from routes.positions import Positions
from protocol.protocol import Protocol


loop = asyncio.new_event_loop()
asyncio.set_event_loop(loop)
positions: Positions = None


async def ws_server(ws: WebSocketServerProtocol):
    protocol = Protocol(ws, positions)
    await protocol.process()


async def main():
    async with serve(ws_server, "localhost", 8080, loop=loop):
        await asyncio.Future()


async def start_scheduler():
    global positions
    routes = Routes(loop=loop)
    await routes.get_routes()
    positions = Positions(routes, loop=loop)
    await positions.scheduler()

if __name__ == '__main__':
    loop.create_task(start_scheduler())
    loop.run_until_complete(main())
