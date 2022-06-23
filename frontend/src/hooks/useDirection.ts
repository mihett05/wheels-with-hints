import React, { useContext, useEffect, useState } from 'react';
import { Control, MapPointerEvent, Marker } from '@2gis/mapgl/global';

import { MapContext } from '../contexts/map';
import { createMachine } from 'xstate';
import { useMachine } from '@xstate/react';

const directionMachine = createMachine({
  id: 'directions',
  initial: 'selectingStart',
  states: {
    selectingStart: {
      on: { SELECT: 'selectingFinish' },
    },
    selectingFinish: {
      on: { SELECT: 'selected' },
    },
    selected: {
      on: { RESET: 'selectingStart' },
    },
  },
});

const directionStateNames: { [key: string]: string } = {
  selectingStart: 'Выберите откуда строить путь',
  selectingFinish: 'Выберите куда строить путь',
  selected: 'Очистить маршрут',
};

type Points = {
  start: number[] | null;
  finish: number[] | null;
};

export function useDirection() {
  const { api, map, directions } = useContext(MapContext);
  const [_, send, service] = useMachine(directionMachine);

  const [points, setPoints] = useState<Points>({
    start: null,
    finish: null,
  });

  const [markers, setMarkers] = useState<Marker[]>([]);

  const getButton = (control: Control): HTMLButtonElement =>
    control.getContainer().querySelector('button') as HTMLButtonElement;

  const buildRoute = (control: Control) => {
    if (directions) {
      directions.carRoute({
        points: [points.start as number[], points.finish as number[]],
      });
      markers.forEach((m) => {
        m.destroy();
      });
      setMarkers([]);
      if (control) {
        getButton(control).disabled = false;
        getButton(control).textContent = directionStateNames[service.state.value as string];
      }
    }
  };

  const onReset = (control: Control) => {
    points.start = null;
    points.finish = null;
    send('RESET');
    directions?.clear();
    getButton(control).disabled = true;
    getButton(control).textContent = directionStateNames.selectingStart;
  };

  const onPoint = (event: MapPointerEvent, control: Control) => {
    console.log(event.lngLat);
    if (api && map) {
      const coords = event.lngLat;
      if (!service.state.matches('selected')) {
        markers.push(
          new api.Marker(map, {
            coordinates: coords,
            icon: 'https://docs.2gis.com/img/dotMarker.svg',
          }),
        );
      }

      if (service.state.matches('selectingStart')) {
        points.start = coords;
        send('SELECT');
      } else if (service.state.matches('selectingFinish')) {
        points.finish = coords;
        send('SELECT');
        buildRoute(control);
      }
      getButton(control).textContent = directionStateNames[service.state.value as string];
    }
  };

  useEffect(() => {
    if (map && api && directions) {
      const htmlControls = `<button id="resetButton" disabled>${directionStateNames.selectingStart}</button>`;
      const control = new api.Control(map, htmlControls, {
        position: 'topRight',
      });
      getButton(control).addEventListener('click', () => onReset(control));
      map.on('click', (event) => onPoint(event, control));

      return () => control.destroy();
    }
  }, [api, map, directions]);
}
