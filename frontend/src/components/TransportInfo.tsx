import React from 'react';
import { Box, Drawer, Typography } from '@mui/material';
import { ITransport } from '../api/transport-api';

interface TransportInfoProps {
  transport: ITransport | null;
  onClose: () => any;
}

const headerStyles = {
  borderRadius: '1em',
  backgroundColor: 'background.paper',
  boxShadow: 24,
  mb: 2,
};

const infoStyles = {
  borderRadius: '1em 1em 0 0',
  backgroundColor: 'background.paper',
  boxShadow: 24,
  p: '0.5em',
  pb: '5em',
};

function TransportInfo({ transport, onClose }: TransportInfoProps) {
  return (
    <Drawer
      open={transport !== null}
      onClose={onClose}
      anchor="bottom"
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0)',
          boxShadow: 0,
        },
      }}
    >
      <Box sx={headerStyles}>
        <Typography variant="h5" textAlign="center">
          Информация о транспорте
        </Typography>
      </Box>
      <Box sx={infoStyles}>
        <Typography variant="h5">Маршрут №{transport?.routeNumber}</Typography>
        <Typography variant="h5">{transport?.routeType === 2 ? 'Трамвай' : 'Автобус'}</Typography>
        <Typography variant="h5">Госномер: {transport?.gosNom}</Typography>
      </Box>
    </Drawer>
  );
}

export default TransportInfo;
