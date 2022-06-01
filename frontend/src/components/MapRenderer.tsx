import React, { useContext, useEffect, useState } from 'react';
import { Marker } from '@2gis/mapgl/global';

import MapWrapper from './MapWrapper';

import { useDirection } from '../hooks/useDirection';
import { useSocket } from '../hooks/useSocket';
import { MapContext } from '../contexts/map';

import busIcon from '../bus_icon.svg';
import tramIcon from '../tram_icon.svg';

function MapRenderer() {
  useDirection();
  const socket = useSocket();

  const { api, map } = useContext(MapContext);
  const [markers, setMarkers] = useState<Marker[]>([]);

  const addMarker = (coords: number[], transportType: 'bus' | 'tram') => {
    markers.push(
      new api!.Marker(map!, {
        coordinates: coords,
        icon: transportType == 'bus' ? busIcon : tramIcon, // сюда transportType прикрутить надо
      }),
    );
  };

  useEffect(() => {
    if (api && map && socket) {
      socket.onUpdate((data) => {
        markers.forEach((m) => m.destroy());
        setMarkers([]);
        data.buses.forEach((t) => addMarker([t.e, t.n], 'bus'));
        data.trams.forEach((t) => addMarker([t.e, t.n], 'tram'));
      });
    }
  }, [api, map, socket]);

  return (
    <>
      <MapWrapper />
    </>
  );
}

export default MapRenderer;
