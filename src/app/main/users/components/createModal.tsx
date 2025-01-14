import React from 'react';
import { Modal, Box, Typography, TextField, Select, MenuItem, Button } from '@mui/material';

const UserCreateModal = ({
  open,
  handleClose,
  createUser,
  handleNewUserFields,
  handleNewUser,
}) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <TextField
          label="Correo"
          value={createUser.mail}
          onChange={(e) => handleNewUserFields('mail', e.target.value)}
          fullWidth
          margin="normal"
          sx={{ bgcolor: '#f9f9f9' }}
        />

        <TextField
          label="Nombre"
          value={createUser.name}
          onChange={(e) => handleNewUserFields('name', e.target.value)}
          fullWidth
          margin="normal"
          sx={{ bgcolor: '#f9f9f9' }}
        />

        <TextField
          label="Apellido Paterno"
          value={createUser.fatherLastName}
          onChange={(e) => handleNewUserFields('fatherLastName', e.target.value)}
          fullWidth
          margin="normal"
          sx={{ bgcolor: '#f9f9f9' }}
        />

        <TextField
          label="Apellido Materno"
          value={createUser.motherLastName}
          onChange={(e) => handleNewUserFields('motherLastName', e.target.value)}
          fullWidth
          margin="normal"
          sx={{ bgcolor: '#f9f9f9' }}
        />

        <Typography variant="h6" sx={{ color: 'black', mt: 1, mb: 1 }}>
          Sede
        </Typography>
        <Select
          value={createUser.sede}
          onChange={(e) => handleNewUserFields('sede', e.target.value)}
          fullWidth
          required
        >
          {['Valparaíso', 'Santiago', 'San Felipe', 'all'].map((sede) => (
            <MenuItem key={sede} value={sede}>
              {sede}
            </MenuItem>
          ))}
        </Select>

        <Button variant="contained" onClick={handleNewUser} sx={{ mt: 2 }}>
          Guardar nuevo usuario
        </Button>
      </Box>
    </Modal>
  );
};

export default UserCreateModal;
