export interface ITransport {
  routeType: number;
  routeNumber: string;
  n: number;
  e: number;
  gosNom: string;
  lf: boolean;
}

interface Transports {
  buses: ITransport[];
  trams: ITransport[];
}

interface IBounds {
  northEast: number[];
  southWest: number[];
}

type updateCallback = (request: Transports) => any;

export class TransportApi {
  public static wsUrl = import.meta.env.VITE_WS_URL;
  private static instance: TransportApi;

  public ws: WebSocket;
  private listeners: updateCallback[] = [];
  public isConnected: boolean = false;

  public connectPromise: Promise<boolean>;

  public static getApi(): TransportApi {
    if (!TransportApi.instance) {
      TransportApi.instance = new TransportApi();
    }
    return TransportApi.instance;
  }

  private constructor() {
    this.ws = new WebSocket(TransportApi.wsUrl);
    this.connectPromise = new Promise((resolve, reject) => {
      this.ws.onopen = () => {
        this.isConnected = true;
        resolve(this.isConnected);
      };
      this.ws.onerror = (event) => {
        reject(event + '');
      };
    });

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

  public changeBounds(bounds: IBounds) {
    this.ws.send(
      JSON.stringify({
        action: 'change_bounds',
        data: bounds,
      }),
    );
  }

  public offUpdate(cb: updateCallback) {
    this.listeners.splice(this.listeners.indexOf(cb), 1);
  }
}
