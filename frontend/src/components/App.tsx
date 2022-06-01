import React from 'react';

import MapRenderer from './MapRenderer';
import { MapProvider } from '../contexts/map';
import MapWrapper from './MapWrapper';

function App() {
  return (
    <MapProvider>
      <div>
        <MapRenderer />
      </div>
    </MapProvider>
  );
}

export default App;
