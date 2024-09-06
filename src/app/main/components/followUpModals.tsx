'use client';
import React from 'react';
import { Box, Button, Modal, TextField, Typography } from "@mui/material";

interface FollowUpModalProps {
  open: boolean;
  onClose: () => void;
  followUpData: { date: string; notes: string };
  setFollowUpData: React.Dispatch<React.SetStateAction<{ date: string; notes: string }>>;
  handleAddFollowUp: () => void;
}

const FollowUpModal: React.FC<FollowUpModalProps> = ({
  open,
  onClose,
  followUpData,
  setFollowUpData,
  handleAddFollowUp,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="follow-up-modal-title"
      aria-describedby="follow-up-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        p: 4,
        width: 400
      }}>
        <Typography id="follow-up-modal-title" variant="h6" component="h2" color='black'>
          Añadir Seguimiento
        </Typography>
        <TextField
          label="Fecha"
          type="date"
          name="date"
          value={followUpData.date}
          onChange={(e) => setFollowUpData({ ...followUpData, date: e.target.value })}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Notas"
          name="notes"
          value={followUpData.notes}
          onChange={(e) => setFollowUpData({ ...followUpData, notes: e.target.value })}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddFollowUp}
          sx={{ mt: 2 }}
        >
          Añadir Seguimiento
        </Button>
      </Box>
    </Modal>
  );
};

export default FollowUpModal;
