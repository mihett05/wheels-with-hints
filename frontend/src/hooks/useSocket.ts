import { useEffect, useState } from 'react';
import { TransportApi } from '../api/transport-api';

export function useSocket(): TransportApi | null {
  const [api, setApi] = useState<TransportApi | null>(null);
  useEffect(() => {
    (async () => {
      const instance = TransportApi.getApi();
      await instance.connectPromise;
      setApi(instance);
    })();
  }, []);

  return api;
}
