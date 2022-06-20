import React from 'react';

const MapWrapper = React.memo(
  () => <div id="map-container" style={{ width: '100vw', height: 'calc(100vh - 50px)', zIndex: -1 }} />,
  () => true,
);

export default MapWrapper;
