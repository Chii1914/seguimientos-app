'use client';
import React from 'react';
import { Box, Button, Modal, TextField, Typography, FormControlLabel, Checkbox } from "@mui/material";

interface FollowUpModalProps {
  open: boolean;
  onClose: () => void;
  followUpData: any;  // Updated to accept dynamic fields
  setFollowUpData: React.Dispatch<React.SetStateAction<any>>;  // Updated to accept dynamic fields
  handleAddFollowUp: () => void;
}

const FollowUpModal: React.FC<FollowUpModalProps> = ({
  open,
  onClose,
  followUpData,
  setFollowUpData,
  handleAddFollowUp,
}) => {
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFollowUpData((prev: any) => ({
      ...prev,
      [name]: checked,
      [`just${name.charAt(0).toUpperCase() + name.slice(1)}`]: checked ? prev[`just${name.charAt(0).toUpperCase() + name.slice(1)}`] : 'none',
    }));
  };

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

        {/* Date field */}
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

        {/* Notes field */}
        <TextField
          label="Notas"
          name="notes"
          value={followUpData.notes}
          onChange={(e) => setFollowUpData({ ...followUpData, notes: e.target.value })}
          fullWidth
          margin="normal"
        />

        {/* Checkboxes with justifications */}
        <FormControlLabel
          control={<Checkbox checked={followUpData.asistentaSocial || false} onChange={(e) => handleCheckboxChange('asistentaSocial', e.target.checked)} />}
          label="Asistenta Social"
        />
        {followUpData.asistentaSocial && (
          <TextField
            label="Justificación Asistenta Social"
            value={followUpData.justAsistentaSocial || ''}
            onChange={(e) => setFollowUpData({ ...followUpData, justAsistentaSocial: e.target.value })}
            fullWidth
            margin="normal"
          />
        )}

        <FormControlLabel
          control={<Checkbox checked={followUpData.ajusteAcademico || false} onChange={(e) => handleCheckboxChange('ajusteAcademico', e.target.checked)} />}
          label="Ajuste Académico"
        />
        {followUpData.ajusteAcademico && (
          <TextField
            label="Justificación Ajuste Académico"
            value={followUpData.justAjusteAcademico || ''}
            onChange={(e) => setFollowUpData({ ...followUpData, justAjusteAcademico: e.target.value })}
            fullWidth
            margin="normal"
          />
        )}

        <FormControlLabel
          control={<Checkbox checked={followUpData.documentoRespaldo || false} onChange={(e) => handleCheckboxChange('documentoRespaldo', e.target.checked)} />}
          label="Documento de Respaldo"
        />
        {followUpData.documentoRespaldo && (
          <TextField
            label="Justificación Documento de Respaldo"
            value={followUpData.justDocumentoRespaldo || ''}
            onChange={(e) => setFollowUpData({ ...followUpData, justDocumentoRespaldo: e.target.value })}
            fullWidth
            margin="normal"
          />
        )}

        <FormControlLabel
          control={<Checkbox checked={followUpData.noAceptaIndicaciones || false} onChange={(e) => handleCheckboxChange('noAceptaIndicaciones', e.target.checked)} />}
          label="No Acepta Indicaciones"
        />
        {followUpData.noAceptaIndicaciones && (
          <TextField
            label="Justificación No Acepta Indicaciones"
            value={followUpData.justNoAceptaIndicaciones || ''}
            onChange={(e) => setFollowUpData({ ...followUpData, justNoAceptaIndicaciones: e.target.value })}
            fullWidth
            margin="normal"
          />
        )}

        {/* Otro field */}
        <TextField
          label="Otro"
          value={followUpData.otro || ''}
          onChange={(e) => setFollowUpData({ ...followUpData, otro: e.target.value })}
          fullWidth
          margin="normal"
        />

        {/* Submit Button */}
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
