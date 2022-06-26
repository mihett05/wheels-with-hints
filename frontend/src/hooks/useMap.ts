import { useState, useContext, useEffect, useCallback } from 'react';

import { MapContext } from '../contexts/map';

export function useMap() {
  const { map } = useContext(MapContext);

  const center = useCallback(
    (coords: number[], zoom = false) => {
      map?.setCenter(coords);
      if (zoom) {
        map?.setZoom(18);
      }
    },
    [map],
  );

  return { map, center };
}
