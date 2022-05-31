from pydantic import BaseModel


class Bus(BaseModel):
    kodPe: int
    routeType: int
    routeId: str
    routeNumber: str
    n: float  # x
    e: float  # y
    course: int
    gosNom: str
    ngr: str
    t: str
