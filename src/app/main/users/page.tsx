"use client";
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { styled } from '@mui/material/styles';
import React, { useState, useEffect } from "react";
import { SelectChangeEvent } from '@mui/material';
import axios from 'axios';
import { Box, Button, Typography, Menu, MenuItem, Modal, TextField, Paper, Select, Checkbox, FormControlLabel, Grid } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Verified } from '@mui/icons-material';
export default function Reports() {

  const [users, setUsers] = useState<any[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [followUps, setFollowUps] = useState<any[]>([]); // State to store follow-ups
    const [fileNames, setFileNames] = useState([]); // State to store file names
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [openModal, setOpenModal] = useState(false);
    const [openModalFollowUp, setOpenModalFollowUp] = useState(false);
    const [userMail, setUserMail] = useState('');
    const [menuAnchorEls, setMenuAnchorEls] = useState<Record<string, HTMLElement | null>>({});
    const [files, setFiles] = useState<File[]>([]);
    const [reload, setReload] = useState(false); // State to trigger re-fetch
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const [filters, setFilters] = useState({
      verified: 'all'
    });

    useEffect(() => {
      axios.get('http://localhost:3000/api/user')
        .then(response => {
          setUsers(response.data);
          console.log('Usuarios cargados:', response.data);
    
        })
        .catch(error => {
          console.error('Error fetching users:', error);
        });
    }, [reload]);

    const deleteUser = async () => {
      alert("No se ha seleccionado un usuario válido para borrar.");
      if (!selectedUser) return;
  
      try {
        await axios.delete(`http://localhost:3000/api/user/${selectedUser.mail}`, {
        });
  
        setReload(!reload);
        alert(`Estado administrativo de ${selectedUser.fatherLastName} borrado correctamente`);
      } catch (error) {
        console.error("Error borrando user status:", error);
      }
    };



    const columns: GridColDef[] = [
      { field: 'mail', headerName: 'Correo', width: 250},
      { field: 'fatherLastName', headerName: 'Apellido Paterno', width: 150 },
      //{ field: 'motherLastName', headerName: 'Apellido Materno', width: 150 },
      { field: 'name', headerName: 'Nombre', width: 150 },
      //{ field: 'secondName', headerName: 'Segundo Nombre', width: 150 },
      //{ field: 'rut', headerName: 'RUT', width: 150 },
      { field: 'sede', headerName: 'Sede', width: 150},
      {
        field: 'actions',
        headerName: 'Acciones',
        width: 200,
        renderCell: (params: GridRenderCellParams) => {
          return (
            <Box display="flex" gap={1}>
              {/* Botón para validar */}
              <Button
                variant="contained"
                color="success"
                //onClick={() => handleStateChange(true)}
                size="small"
                startIcon={<CheckCircleIcon />}
              >
                {/* Texto opcional */}
              </Button>
    
              {/* Botón para eliminar */}
              <Button
                variant="contained"
                color="error"
                onClick={() => deleteUser()}
                size="small"
                startIcon={<CancelIcon />}
              >
                {/* Texto opcional */}
              </Button>
    
              {/* Botón para pedir otro documento */}
              <Button
                variant="contained"
                color="primary"
                //onClick={() => handleFileUpload(params.row)}
                size="small"
                startIcon={<DescriptionIcon />} // Ícono representativo para documentos
              >
                {/* Texto opcional */}
              </Button>
            </Box>
          );
        },
        sortable: false,
        filterable: false,
      },
    ];

  
  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
  
              
                
  
              <Box sx={{ flexGrow: 1 }}>
                  <Paper elevation={3}>
                  <DataGrid
                      rows={users}
                      columns={columns}
                      getRowId={(row) => row.mail}  // Use mail as the unique row identifier
                      sx={{ height: '100%', width: '100%' }}  // Ensure DataGrid fills the container
                      />
                  </Paper>
              </Box>
      </main>
    )
  
  }