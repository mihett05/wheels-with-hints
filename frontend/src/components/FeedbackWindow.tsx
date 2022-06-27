import React, { useState } from 'react';
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
  const [state, setState] = useState<'feedback' | 'success'>('feedback');

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
          {state === 'feedback' ? (
            <>
              <TextField label="Сообщение" focused variant="standard" multiline rows={4} maxRows={4} sx={{ mb: 2 }} />
              <br />
              <Box>
                <Button
                  variant="contained"
                  sx={{ mb: 2 }}
                  onClick={() =>
                    setTimeout(() => {
                      setState('success');
                    }, 1000)
                  }
                >
                  Отправить
                </Button>
                <br />
                <Button variant="outlined" sx={{ mb: 2 }} onClick={onClose}>
                  Закрыть
                </Button>
              </Box>
            </>
          ) : (
            <Typography>Спасибо за ваш отзыв!</Typography>
          )}
        </Box>
      </Box>
    </Modal>
  );
}

export default FeedbackWindow;
