from pydantic import BaseModel


class Transport(BaseModel):
    kodPe: int
    routeType: int
    routeId: str
    routeNumber: str
    n: float  # x
    e: float  # y
    # course: int
    # gosNom: str
    # ngr: str
    lf: bool  # true - низкий пол, false - высокий пол
    # t: str
