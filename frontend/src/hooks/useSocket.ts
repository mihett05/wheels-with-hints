import { useEffect, useState } from 'react';
import { TransportApi } from '../api/transport-api';

export function useSocket(): TransportApi | null {
  const [api, setApi] = useState<TransportApi | null>(null);
  useEffect(() => {
    setApi(TransportApi.getApi());
  }, []);

  return api;
}
