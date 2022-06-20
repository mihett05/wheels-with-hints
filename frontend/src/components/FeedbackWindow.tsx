import React from 'react';
import { Box, Modal, Typography, SxProps, TextField, Button, Link } from '@mui/material';

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

function FeedbackWindow({ open, onClose }: { open: boolean; onClose: () => any }) {
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
          Обратная связь
        </Typography>
        <Box id="modal-modal-description">
          <TextField label="Сообщение" focused variant="standard" multiline rows={4} maxRows={4} sx={{ mb: 2 }} />
          <br />
          <Box>
            <Button variant="contained" sx={{ mb: 2 }}>
              Отправить
            </Button>
            <br />
            <Button variant="outlined" sx={{ mb: 2 }} onClick={onClose}>
              Закрыть
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default FeedbackWindow;
