import React from 'react';

import MapRenderer from './MapRenderer';
import { MapProvider } from '../contexts/map';
import BottomBar from './BottomBar';

function App() {
  return (
    <div
      style={{
        height: '100vh',
      }}
    >
      <MapProvider>
        <MapRenderer />
        <BottomBar />
      </MapProvider>
    </div>
  );
}

export default App;
