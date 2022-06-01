import React from 'react';

const MapWrapper = React.memo(
  () => <div id="map-container" style={{ width: '100vw', height: '100vh' }} />,
  () => true,
);

export default MapWrapper;
