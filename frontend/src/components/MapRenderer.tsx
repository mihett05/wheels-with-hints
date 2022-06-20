import React, { useContext, useEffect, useState } from 'react';
import { Marker } from '@2gis/mapgl/global';

import { ITransport } from '../api/transport-api';

import { useDirection } from '../hooks/useDirection';
import { useSocket } from '../hooks/useSocket';
import { MapContext } from '../contexts/map';

import MapWrapper from './MapWrapper';
import TransportInfo from './TransportInfo';

import busIcon from '../images/bus_icon.svg';
import tramIcon from '../images/tram_icon.svg';

function MapRenderer() {
  useDirection();
  const socket = useSocket();

  const { api, map } = useContext(MapContext);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [selected, setSelected] = useState<ITransport | null>(null);

  const addMarker = (transport: ITransport, transportType: 'bus' | 'tram') => {
    const marker = new api!.Marker(map!, {
      coordinates: [transport.e, transport.n],
      icon: transportType == 'bus' ? busIcon : tramIcon,
    });
    marker.on('click', () => setSelected(transport));
    markers.push(marker);
  };

  useEffect(() => {
    if (api && map && socket) {
      socket.onUpdate((data) => {
        markers.forEach((m) => m.destroy());
        setMarkers([]);
        data.buses.forEach((t) => addMarker(t, 'bus'));
        data.trams.forEach((t) => addMarker(t, 'tram'));
      });
      map.on('moveend', () => {
        socket.changeBounds(map.getBounds());
      });
      map.emit('moveend');
    }
  }, [api, map, socket]);

  return (
    <>
      <MapWrapper />
      <TransportInfo transport={selected} onClose={() => setSelected(null)} />
    </>
  );
}

export default MapRenderer;
