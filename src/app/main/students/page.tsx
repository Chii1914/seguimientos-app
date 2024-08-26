'use client';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Box, Button, Typography, Menu, MenuItem, Modal } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState<{
    name: string;
    secondName: string;
    fatherLastName: string;
    motherLastName: string;
    semester: string;
    rut: string;
    df: string
  } | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [menuAnchorEls, setMenuAnchorEls] = useState<Record<number, HTMLElement | null>>({});

  useEffect(() => {
    // Fetch data from the API when the component mounts
    axios.get('http://localhost:3000/api/students')
      .then(response => {
        setStudents(response.data);  // Update state with the fetched data
      })
      .catch(error => {
        console.error('Error fetching students:', error);
      });
  }, []);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, studentId: number) => {
    setMenuAnchorEls((prev) => ({ ...prev, [studentId]: event.currentTarget }));
  };

  const handleMenuClose = (studentId: number) => {
    setMenuAnchorEls((prev) => ({ ...prev, [studentId]: null }));
  };

  const handleModalOpen = (student: any) => {
    setSelectedStudent(student);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedStudent(null);
  };

  // Define columns for DataGrid
  const columns: GridColDef[] = [
    { field: 'fatherLastName', headerName: 'Apellido Paterno', width: 150 },
    { field: 'motherLastName', headerName: 'Apellido Materno', width: 150 },
    { field: 'name', headerName: 'Nombre', width: 150 },
    { field: 'secondName', headerName: 'Segundo Nombre', width: 150 },
    { field: 'semester', headerName: 'Semestre', width: 100 },
    { field: 'rut', headerName: 'RUT', width: 150 },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 300,
      renderCell: (params: GridRenderCellParams) => {
        const isMenuOpen = Boolean(menuAnchorEls[params.row.id]);

        return (
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleModalOpen(params.row)}
            >
              Ver Alumno
            </Button>
            <Button
              aria-controls={isMenuOpen ? 'demo-positioned-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={isMenuOpen ? 'true' : undefined}
              onClick={(event) => handleMenuClick(event, params.row.id)}
            >
              Exportar
            </Button>
            <Menu
              id="demo-positioned-menu"
              anchorEl={menuAnchorEls[params.row.id]}
              open={isMenuOpen}
              onClose={() => handleMenuClose(params.row.id)}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <MenuItem onClick={() => handleMenuClose(params.row.id)}>Exportar a excel</MenuItem>
              <MenuItem onClick={() => handleMenuClose(params.row.id)}>Exportar a word</MenuItem>
            </Menu>
          </Box>
        );
      },
      sortable: false,
      filterable: false
    },
  ];

  // Modal styling
  const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Box>
        <Button>Exportar todos los estudiantes</Button>
        <Button>Exportar por rango de fecha</Button>
      </Box>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={students}
          columns={columns}
          disableSelectionOnClick
        />
      </Box>

      <Modal open={openModal} onClose={handleModalClose}>
        <Box sx={modalStyle}>
          <Typography variant="h4" component="h2">
            Información del Alumno
          </Typography>
          {selectedStudent && (
            <>
              <Typography typography='h5'>Nombre: {selectedStudent.name}</Typography>
              <Typography typography='h5'>Segundo Nombre: {selectedStudent.secondName}</Typography>
              <Typography typography='h5'>Apellido Paterno: {selectedStudent.fatherLastName}</Typography>
              <Typography typography='h5'>Apellido Materno: {selectedStudent.motherLastName}</Typography>

              <Typography>Semestre: {selectedStudent.semester}</Typography>
              <Typography>RUT: {selectedStudent.rut}</Typography>

            </>
          )}
          <Button onClick={handleModalClose} color="primary">Cerrar</Button>
        </Box>
      </Modal>
    </>
  );
}
