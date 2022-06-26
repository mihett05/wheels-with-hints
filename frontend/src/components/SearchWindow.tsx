import React, { useEffect, useState } from 'react';
import { Box, Modal, Typography, SxProps, TextField, Button, Link } from '@mui/material';
import { useMap } from '../hooks/useMap';

const style: SxProps = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  borderRadius: 5,
  boxShadow: 24,
  p: 4,
  textAlign: 'center',
};

const searchCache: Record<string, number[]> = {};

function SearchWindow({ open, onClose }: { open: boolean; onClose: () => any }) {
  const [search, setSearch] = useState('');
  const { center } = useMap();

  const getAddress = (value: string): number[] => {
    // fake search
    const key = value.trim().toLowerCase();
    if (key.toLowerCase().includes('хабаровск')) return [56.08878928202345, 58.05121497640009];

    if (searchCache[key] === undefined) {
      searchCache[key] = [56 + Math.random() / 10 + 0.2, 58 + Math.random() / 20 - 0.05];
    }

    return searchCache[key];
  };

  const onSubmit = (value: string) => {
    if (value.trim() !== '') {
      center(getAddress(value));
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          sx={{
            pb: 4,
          }}
        >
          Поиск
        </Typography>
        <Box id="modal-modal-description">
          <TextField
            variant="filled"
            sx={{
              mb: 2,
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Box>
            <Button
              variant="contained"
              sx={{ mb: 2 }}
              onClick={() => {
                setTimeout(() => {
                  onSubmit(search);
                  onClose();
                  setSearch('');
                }, 100);
              }}
            >
              Найти
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default SearchWindow;
