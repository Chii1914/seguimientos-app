"use client";
import { styled } from '@mui/material/styles';
import React, { useState, useEffect } from "react";
import { SelectChangeEvent } from '@mui/material';
import axios from 'axios';
import { Box, Button, Typography, Menu, MenuItem, Modal, TextField, Paper, Select, Checkbox, FormControlLabel, Grid } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
export default function Students() {

  const [students, setStudents] = useState<any[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [followUps, setFollowUps] = useState<any[]>([]); // State to store follow-ups
  const [fileNames, setFileNames] = useState([]); // State to store file names
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openModalFollowUp, setOpenModalFollowUp] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [menuAnchorEls, setMenuAnchorEls] = useState<Record<string, HTMLElement | null>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [reload, setReload] = useState(false); // State to trigger re-fetch
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    consumoSustancias: false,
    convivencia: false,
    emocional: false,
    academico: false,
    uvinclusiva: false,
    abuso: false,
    economicos: false,
    emocionalYAcademico: false,
    economicoEmocionalAcademico: false,
    economicoEmocional: false,
    economicoAcademico: false,
    state: 'all'
  });

  useEffect(() => {
    // Datos simulados para prueba
    const mockStudents = [
      {
        _id: "1",
        fatherLastName: "Pérez",
        motherLastName: "Gómez",
        name: "Juan",
        secondName: "Carlos",
        semester: "2",
        rut: "12345678-9",
        verified: true
      },
      {
        _id: "2",
        fatherLastName: "López",
        motherLastName: "Martínez",
        name: "Ana",
        secondName: "María",
        semester: "4",
        rut: "98765432-1",
        verified: false
      },
    ];
    setStudents(mockStudents);
    setFilteredStudents(mockStudents);
  }, []);
  
  const fetchFileNames = async (studentId: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/student/${studentId}/filenames`);
      setFileNames(response.data);
    } catch (error) {
      console.error('Error fetching file names:', error);
    }
  };

  const handleFilterChange = (
      event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
    ) => {
      const { name, value } = event.target as HTMLInputElement | { name: string; value: string };
      const checked = (event.target as HTMLInputElement).checked;
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: (event.target as HTMLInputElement).type === 'checkbox' ? checked : value,
      }));
    };
    useEffect(() => {
      const filtered = students.filter((student) => {
        return Object.keys(filters).every((key) => {
          if (filters[key as keyof typeof filters]) {
            return student[key] === true;
          }
          return true;
        });
      });
      setFilteredStudents(filtered);
    }, [filters, students]);


  const handleStateChange = async (newState: boolean) => {
    if (!selectedStudent) return;

    try {
      await axios.patch(`http://localhost:3000/api/student/${selectedStudent._id}`, {
        state: newState
      });

      setReload(!reload);
      alert(`Estado administrativo de ${selectedStudent.fatherLastName} actualizado correctamente`);
      handleMenuClose("");
    } catch (error) {
      console.error("Error updating student status:", error);
    }
  };

    const handleSubmit = () => {
      setOpenModalFollowUp(true);
    }
  
    const handleMenuClick = (event: React.MouseEvent<HTMLElement>, studentId: string) => {
      setMenuAnchorEls((prev) => ({ ...prev, [studentId]: event.currentTarget }));
    };
    
    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, student: any) => {
        setAnchorEl(event.currentTarget);
        setSelectedStudent(student);
      };

    const handleMenuClose = (studentId: string) => {
      setMenuAnchorEls((prev) => ({ ...prev, [studentId]: null }));
      setAnchorEl(null);
  
    };
  
    const handleModalOpen = async (student: any) => {
      setSelectedStudent(student);
      setOpenModal(true);
      fetchFileNames(student._id);
    };
 
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
        return (
          <Box>
            <Button variant="contained" color="primary" onClick={() => handleModalOpen(params.row)}>
              Validar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={(event) => handleMenuOpen(event, params.row)}
            >
              Eliminar
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleModalOpen(params.row)}>
              Pedir otro documento
            </Button>

            {/* Menu for state change */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => handleStateChange(true)}>Procesado</MenuItem>
              <MenuItem onClick={() => handleStateChange(false)}>Pendiente</MenuItem>
            </Menu>
          </Box>
        );
      },
      sortable: false,
      filterable: false
    },
  ]; 
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Typography
              variant="h1"
              className="text-center"
            >
             Reports
            </Typography>
            
                  
            <Grid item>
                <FormControlLabel
                    control={
                    <Select
                        name="state"
                        value={filters.state}
                        onChange={handleFilterChange}
                        displayEmpty
                    >
                        <MenuItem value="all">Todos</MenuItem>
                        <MenuItem value="pendiente">Pendiente</MenuItem>
                        <MenuItem value="procesado">Procesado</MenuItem>
                    </Select>
                    }
                    label="Estado"
                    labelPlacement="start"
                />
                </Grid>

            <Box sx={{ flexGrow: 1 }}>
                <Paper elevation={3}>
                <DataGrid
                    rows={filteredStudents}
                    columns={columns}
                    getRowId={(row) => row._id}  // Use _id as the unique row identifier
                    sx={{ height: '100%', width: '100%' }}  // Ensure DataGrid fills the container
                    />
                </Paper>
            </Box>
    </main>
  )

}
