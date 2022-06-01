interface ITransport {
  kodPe: number;
  routeType: number;
  routeId: string;
  routeNumber: string;
  n: number;
  e: number;
  lf: boolean;
}

interface Transports {
  buses: ITransport[];
  trams: ITransport[];
}

type updateCallback = (request: Transports) => any;

export class TransportApi {
  public static wsUrl = import.meta.env.VITE_WS_URL;
  private static instance: TransportApi;

  public ws: WebSocket;
  private listeners: updateCallback[] = [];
  public isConnected: boolean = false;

  public static getApi(): TransportApi {
    if (!TransportApi.instance) {
      TransportApi.instance = new TransportApi();
    }
    return TransportApi.instance;
  }

  private constructor() {
    this.ws = new WebSocket(TransportApi.wsUrl);
    this.ws.onopen = () => {
      this.isConnected = true;
    };
    this.ws.onclose = () => {
      this.isConnected = false;
    };
    this.ws.onmessage = (event) => {
      if (event.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          const data = JSON.parse(reader.result as string).data;
          this.listeners.forEach((cb) => cb(data));
        };
        reader.readAsText(event.data);
      }
    };
  }

  public onUpdate(cb: updateCallback) {
    this.listeners.push(cb);
  }

  public offUpdate(cb: updateCallback) {
    this.listeners.splice(this.listeners.indexOf(cb), 1);
  }
}
