"use client";
import React, { useState, useEffect } from "react";

import { Box, Button, MenuItem, Select, TextField, Modal, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import { useAuth } from "../lib/auth";
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from "axios";
import CreateIcon from '@mui/icons-material/Create';
import Cookies from "js-cookie";
import Swal from 'sweetalert2';
import ModifyModal from "./components/modifyModal";
import __url from '../lib/const'

export default function Reports() {
  const [reload, setReload] = useState(false);
  const [users, setUsers] = useState<any[]>([])
  const [open, setOpen] = React.useState(false);
  const [openModalNew, setOpenNewModal] = React.useState(false);
  const handleOpen = (user: any) => { setSelectedUser(user); setNewUser(user); setOpen(true); }
  const handleClose = () => { setSelectedUser([]); setOpen(false); }
  const handleOpenNew = () => { setOpenNewModal(true); }
  const handleCloseNew = () => { setOpenNewModal(false); }
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newUser, setNewUser] = useState({
    mail: '',
    name: '',
    secondName: '',
    fatherLastName: '',
    motherLastName: '',
    sede: '',
  });
  const [createUser, setCreateUser] = useState({
    mail: '',
    name: '',
    secondName: '',
    fatherLastName: '',
    motherLastName: '',
    sede: '',
  });

  const handleNewUserFields = (key: string, value: string | boolean) => {
    setCreateUser((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleChangeNewUser = (key: string, value: string | boolean) => {
    setNewUser((prev: any) => ({ ...prev, [key]: value }));
  };
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
  useEffect(() => {
    axios.get(`${__url}/user`, { headers: { Authorization: `${Cookies.get('xvlf')}` } })
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, [reload]);

  const columns: GridColDef[] = [
    { field: 'mail', headerName: 'Correo', width: 150 },
    { field: 'name', headerName: 'Nombre', width: 150 },
    { field: 'fatherLastName', headerName: 'Apellido Paterno', width: 150 },
    { field: 'motherLastName', headerName: 'Apellido Materno', width: 150 },
    { field: 'sede', headerName: 'Semestre', width: 100 },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 300,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Box display="flex" gap={1}>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                handleOpen(params.row);
              }}
              size="small"
              startIcon={<CreateIcon />}
            >
              Modificar
            </Button>

            {/* Botón para eliminar */}
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleDelete(params.row.mail);
              }}
              size="small"
              startIcon={<CancelIcon />}
            >
              Borrar
            </Button>

          </Box>
        );
      },
      sortable: false,
      filterable: false,
    },
  ];

  const handleSubmit = async () => {
    try {
      await axios.patch(`${__url}/user/${selectedUser.mail}`, newUser, { headers: { Authorization: `${Cookies.get('xvlf')}` } })
      setReload(!reload);
      handleClose();
      setNewUser({
        mail: '',
        name: '',
        secondName: '',
        fatherLastName: '',
        motherLastName: '',
        sede: '',
      })
      Swal.fire({
        toast: true,
        title: 'Usuario modificado',
        icon: 'warning',
        confirmButtonText: 'Ok'
      });
    }
    catch (err) {
      console.error(err);
    }
  }

  const handleNewUser = async () => {
    try {
      await axios.post(`${__url}/user`, createUser, { headers: { Authorization: `${Cookies.get('xvlf')}` } })
      setReload(!reload);
      handleCloseNew();
      setCreateUser({
        mail: '',
        name: '',
        secondName: '',
        fatherLastName: '',
        motherLastName: '',
        sede: ''
      })
      Swal.fire({
        toast: true,
        title: 'Usuario añadido',
        icon: 'success',
        confirmButtonText: 'Ok'
      });
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (mail: string) => {
    const result = await Swal.fire({
      title: 'Atención!',
      text: `Borrar al usuario ${mail} será de caracter permanente, no se podrá recuperar`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${__url}/user/${mail}`, { headers: { Authorization: `${Cookies.get('xvlf')}` } });
        setReload(!reload)
        handleClose();
        Swal.fire('Deleted!', 'The user has been deleted.', 'success');
      } catch (err: any) {
        console.error(err);
        if (err.response.status === 403) {
          Swal.fire('Error', 'No tienes permiso para borrar usuarios', 'error');
        } else {
          Swal.fire('Error', 'No tienes permiso para borrar usuarios', 'error');
        }
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Typography
        variant="h3"
        className="text-center"
      >
        Gestión de usuarios
      </Typography>
      <Button variant="outlined" onClick={() => handleOpenNew()}>
        Añadir Usuario
      </Button>
      <DataGrid
        rows={users}
        columns={columns}
        getRowId={(row) => row.mail}
        sx={{ height: "100%", width: "100%" }}
      />

      <Modal open={openModalNew} onClose={handleCloseNew}>
        <Box>
          <Box sx={style}>

            <TextField
              label="Correo"
              value={createUser.mail}
              onChange={(e) => handleNewUserFields('mail', e.target.value)}
              fullWidth
              margin="normal"
              sx={{ bgcolor: '#f9f9f9' }} // Light grey background for input fields
            />


            <TextField
              label="Nombre"
              value={createUser.name}
              onChange={(e) => handleNewUserFields('name', e.target.value)}
              fullWidth
              margin="normal"
              sx={{ bgcolor: '#f9f9f9' }} // Light grey background for input fields
            />

            <TextField
              label="Apellido paterno"
              value={createUser.fatherLastName}
              onChange={(e) => handleNewUserFields('fatherLastName', e.target.value)}
              fullWidth
              margin="normal"
              sx={{ bgcolor: '#f9f9f9' }} // Light grey background for input fields
            />

            <TextField
              label="Apellido materno"
              value={createUser.motherLastName}
              onChange={(e) => handleNewUserFields('motherLastName', e.target.value)}
              fullWidth
              margin="normal"
              sx={{ bgcolor: '#f9f9f9' }} // Light grey background for input fields
            />

            <Typography variant="h6" style={{ color: 'black', marginTop: '3px', marginBottom: '3px' }}>Sede</Typography>
            <Select
              label="Sede"
              name="sede"
              value={createUser.sede}
              onChange={(e) => handleNewUserFields('sede', e.target.value)}
              fullWidth
              required
            >
              {['Valparaíso', 'Santiago', 'San Felipe', 'all'].map((sede) => (
                <MenuItem key={sede} value={sede}>{sede}</MenuItem>
              ))}
            </Select>
            <Button variant="contained" onClick={() => handleNewUser()}> Guardar nuevo usuario </Button>          </Box>
        </Box>
      </Modal>

      <ModifyModal
        open={open}
        handleClose={handleClose}
        newUser={newUser}
        selectedUser={selectedUser}
        handleChangeNewUser={handleChangeNewUser}
        handleSubmit={handleSubmit}
      />
    </main>
  );
}