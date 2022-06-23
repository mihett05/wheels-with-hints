import { useState, useContext, useEffect } from 'react';

import { MapContext } from '../contexts/map';

export function useMap() {
  const { map } = useContext(MapContext);
  const [center, setCenter] = useState<(coords: number[]) => any>(() => {});

  useEffect(() => {
    setCenter(() => (coords: number[]) => map?.setCenter(coords));
  }, [map]);

  return { map, center };
}
