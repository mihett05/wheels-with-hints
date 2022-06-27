import React, { useState } from 'react';
import { Box, Modal, Typography, SxProps, TextField, Button, Link } from '@mui/material';
import FeedbackWindow from './FeedbackWindow';

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

function SupportWindow({ open, onClose }: { open: boolean; onClose: () => any }) {
  const [fbOpen, setFbOpen] = useState(false);

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
          Обращение в тех. поддержку
        </Typography>
        <Box id="modal-modal-description">
          <TextField
            label="Ваше имя"
            focused
            variant="standard"
            sx={{
              mb: 2,
            }}
          />
          <TextField
            label="Контактный E-Mail"
            focused
            variant="standard"
            sx={{
              mb: 2,
            }}
          />
          <TextField label="Сообщение" focused variant="standard" multiline rows={4} maxRows={4} sx={{ mb: 2 }} />
          <br />
          <Box>
            <Button
              variant="contained"
              sx={{ mb: 2 }}
              onClick={() => {
                setTimeout(onClose, 1000);
              }}
            >
              Отправить
            </Button>
            <br />
            <Typography>Номер тефона тех. подержки: 89526644585</Typography>
            <Link href="#" onClick={() => setFbOpen(true)}>
              или предоставить обратную связь
            </Link>
            <FeedbackWindow open={fbOpen} onClose={() => setFbOpen(false)} />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default SupportWindow;
