import React from 'react';
import { Modal, Box, Typography, TextField, Select, MenuItem, Button } from '@mui/material';

interface User {
    name: string;
    fatherLastName: string;
    motherLastName: string;
    mail: string;
    sede: string;
}

const ModifyModal = ({
    open,
    handleClose,
    newUser,
    selectedUser,
    handleChangeNewUser,
    handleSubmit,
}: {
    open: boolean;
    handleClose: () => void;
    newUser: User;
    selectedUser: User | null;
    handleChangeNewUser: (field: keyof User, value: string) => void;
    handleSubmit: () => void;
}) => {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title">
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6">
                    {selectedUser ? `${selectedUser.name} ${selectedUser.fatherLastName} ${selectedUser.motherLastName}` : 'Usuario'}
                </Typography>

                <TextField
                    label="Correo"
                    value={newUser.mail}
                    onChange={(e) => handleChangeNewUser('mail', e.target.value)}
                    fullWidth
                    margin="normal"
                    sx={{ bgcolor: '#f9f9f9' }}
                />

                <TextField
                    label="Nombre"
                    value={newUser.name}
                    onChange={(e) => handleChangeNewUser('name', e.target.value)}
                    fullWidth
                    margin="normal"
                    sx={{ bgcolor: '#f9f9f9' }}
                />

                <TextField
                    label="Apellido Paterno"
                    value={newUser.fatherLastName}
                    onChange={(e) => handleChangeNewUser('fatherLastName', e.target.value)}
                    fullWidth
                    margin="normal"
                    sx={{ bgcolor: '#f9f9f9' }}
                />

                <TextField
                    label="Apellido Materno"
                    value={newUser.motherLastName}
                    onChange={(e) => handleChangeNewUser('motherLastName', e.target.value)}
                    fullWidth
                    margin="normal"
                    sx={{ bgcolor: '#f9f9f9' }}
                />

                <Typography variant="h6" sx={{ color: 'black', mt: 1, mb: 1 }}>
                    Sede
                </Typography>
                <Select
                    value={newUser.sede}
                    onChange={(e) => handleChangeNewUser('sede', e.target.value)}
                    fullWidth
                    required
                >
                    {['Valparaíso', 'Santiago', 'San Felipe', 'all'].map((sede) => (
                        <MenuItem key={sede} value={sede}>
                            {sede}
                        </MenuItem>
                    ))}
                </Select>

                <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
                    Guardar cambios
                </Button>
            </Box>
        </Modal>
    );
};

export default ModifyModal;
