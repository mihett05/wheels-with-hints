import React, { createContext, useEffect, useRef, useState } from 'react';
import { Map } from '@2gis/mapgl/global';
import { load } from '@2gis/mapgl';
import { Directions } from '@2gis/mapgl-directions';

type ApiType = Awaited<ReturnType<typeof load>>;

interface IMapContext {
  api: ApiType | null;
  map: Map | null;
  directions: Directions | null;
}

export const MapContext = createContext<IMapContext>({
  api: null,
  map: null,
  directions: null,
});

export function MapProvider({ children }: { children: React.ReactNode }) {
  const [api, setApi] = useState<ApiType | null>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [directions, setDirections] = useState<Directions | null>(null);

  const isMounted = useRef();

  const loadMap = async () => {
    const _api = await load();
    const _map = new _api.Map('map-container', {
      center: [56.255580173572234, 58.0109572089396],
      zoom: 13,
      key: import.meta.env.VITE_MAPGL_API_KEY,
    });
    const _directions = new Directions(_map, {
      directionsApiKey: import.meta.env.VITE_DIRECTIONS_API_KEY,
    });

    setApi(_api);
    setMap(_map);
    setDirections(_directions);
    return _map;
  };

  useEffect(() => {
    if (isMounted.current) return;
    //@ts-ignore
    isMounted.current = true; // пидорасы похерили useEffect в dev моде

    let _map: Map | null = null;
    (async () => {
      _map = await loadMap();
    })();
    return () => _map?.destroy();
  }, []);

  return (
    <MapContext.Provider
      value={{
        api,
        map,
        directions,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}
