'use client';
import React, { useState, useEffect } from "react";
import { SelectChangeEvent } from '@mui/material';
import {useAuth} from "../lib/auth";
import axios from 'axios';
import { Box, Button, Typography, Menu, MenuItem, Modal, TextField, Paper, Select, Checkbox, FormControlLabel, Grid } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import FollowUpModal from "../components/followUpModals";
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

  const [followUpData, setFollowUpData] = useState({
    date: '',
    notes: '',
    asistentaSocial: false,
    justAsistentaSocial: 'none',
    ajusteAcademico: false,
    justAjusteAcademico: 'none',
    documentoRespaldo: false,
    justDocumentoRespaldo: 'none',
    noAceptaIndicaciones: false,
    justNoAceptaIndicaciones: 'none',
    otro: 'none',
  });


  useEffect(() => {
    if (selectedStudent) {
      const fetchFollowUps = async () => {
        try {
          const response = await axios.get(`https://segapi.administracionpublica-uv.cl/api/student/${selectedStudent._id}/follow-ups`);
          setFollowUps(response.data);
        } catch (error) {
          console.error('Error fetching follow-ups:', error);
        }
      };

      fetchFollowUps();
    } else {
      setFollowUps([]); // Clear follow-ups when no student is selected
    }
  }, [selectedStudent]);

  useEffect(() => {
    axios.get('http://localhost:6969/api/student')
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error('Error fetching students:', error);
      });
  }, [reload]);

  useEffect(() => {
    const filtered = students.filter((student) => {
      const matchesFilters = Object.keys(filters).every((key) => {
        if (key === 'state') {
          if (filters.state === 'pendiente') return student.state === false;
          if (filters.state === 'procesado') return student.state === true;
          return true; // 'all'
        }
        if (filters[key as keyof typeof filters]) {
          return student[key] === true;
        }
        return true;
      });

      return matchesFilters;
    });
    setFilteredStudents(filtered);
  }, [filters, students]);

  const fetchFollowUps = async (studentId: string) => {
    try {
      const response = await axios.get(`https://segapi.administracionpublica-uv.cl/api/student/${studentId}/follow-ups`);
      setFollowUps(response.data);
    } catch (error) {
      console.error('Error fetching follow-ups:', error);
    }
  };

  const handleDownload = async (fileName: string) => {
    try {
      const response = await axios.get(`https://segapi.administracionpublica-uv.cl/api/student/download/${selectedStudent._id}/${fileName}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }

  const handleAddFollowUp = async () => {
    if (!selectedStudent) return;
    const followUp = {
      ...followUpData,
      asistentaSocial: followUpData.asistentaSocial || false,
      justAsistentaSocial: followUpData.asistentaSocial ? followUpData.justAsistentaSocial : 'none',
      ajusteAcademico: followUpData.ajusteAcademico || false,
      justAjusteAcademico: followUpData.ajusteAcademico ? followUpData.justAjusteAcademico : 'none',
      documentoRespaldo: followUpData.documentoRespaldo || false,
      justDocumentoRespaldo: followUpData.documentoRespaldo ? followUpData.justDocumentoRespaldo : 'none',
      noAceptaIndicaciones: followUpData.noAceptaIndicaciones || false,
      justNoAceptaIndicaciones: followUpData.noAceptaIndicaciones ? followUpData.justNoAceptaIndicaciones : 'none',
      otro: followUpData.otro || 'none',
    };
    try {
      await axios.post(`https://segapi.administracionpublica-uv.cl/api/student/add-follow-up`, {
        id: selectedStudent._id,
        follow_up: followUp,
      });
      setOpenModalFollowUp(false);
      setFollowUpData({
        date: '',
        notes: '',
        asistentaSocial: false,
        justAsistentaSocial: 'none',
        ajusteAcademico: false,
        justAjusteAcademico: 'none',
        documentoRespaldo: false,
        justDocumentoRespaldo: 'none',
        noAceptaIndicaciones: false,
        justNoAceptaIndicaciones: 'none',
        otro: 'none',
      });
      fetchFollowUps(selectedStudent._id);
    } catch (error) {
      console.error('Error adding follow-up:', error);
    }
  }
  const handleFileUpload = async (studentId: string) => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      await axios.post(`https://segapi.administracionpublica-uv.cl/api/student/files/${studentId}`, formData);
      fetchFileNames(studentId);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  }

  const handleSubmit = () => {
    setOpenModalFollowUp(true);
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, studentId: string) => {
    setMenuAnchorEls((prev) => ({ ...prev, [studentId]: event.currentTarget }));
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

  const fetchFileNames = async (studentId: string) => {
    try {
      const response = await axios.get(`https://segapi.administracionpublica-uv.cl/api/student/${studentId}/filenames`);
      setFileNames(response.data);
    } catch (error) {
      console.error('Error fetching file names:', error);
    }
  };


  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedStudent(null);
    setFileNames([]);
  };

  // Handle changes to text fields and checkboxes
  const handleChange = (key: string, value: string | boolean) => {
    setSelectedStudent((prev: any) => ({ ...prev, [key]: value }));
  };

  // Handle update request
  const handleUpdate = () => {
    if (!selectedStudent) return;

    const { _id, follow_ups, __v, ...studentData } = selectedStudent;

    axios.patch(`https://segapi.administracionpublica-uv.cl/api/student/${_id}`, studentData)
      .then(response => {
        setStudents((prevStudents: any[]) =>
          prevStudents.map((student) =>
            student._id === _id ? { ...student, ...studentData } : student
          )
        );
        setOpenModal(false);
        setSelectedStudent(null);
      })
      .catch(error => {
        console.error('Error updating student:', error);
      });
  };
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, student: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student);
  };
  const handleStateChange = async (newState: boolean) => {
    if (!selectedStudent) return;

    try {
      await axios.patch(`https://segapi.administracionpublica-uv.cl/api/student/${selectedStudent._id}`, {
        state: newState
      });

      setReload(!reload);
      alert(`Estado administrativo de ${selectedStudent.fatherLastName} actualizado correctamente`);
      handleMenuClose("");
    } catch (error) {
      console.error("Error updating student status:", error);
    }
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
        return (
          <Box>
            <Button variant="contained" color="primary" onClick={() => handleModalOpen(params.row)}>
              Ver Alumno
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={(event) => handleMenuOpen(event, params.row)}
            >
              Procesar
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
    <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, px: 2 }}>
        <Button variant="outlined" color="primary">Exportar todos los estudiantes</Button>
        <Button variant="outlined" color="secondary" sx={{ ml: 2 }}>Exportar por rango de fecha</Button>
      </Box>
      <Grid item>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.consumoSustancias}
              onChange={handleFilterChange}
              name="consumoSustancias"
            />
          }
          label="Consumo Problemático de Sustancias"
        />
      </Grid>
      <Grid item>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.convivencia}
              onChange={handleFilterChange}
              name="convivencia"
            />
          }
          label="Convivencia y Buen Trato"
        />
      </Grid>
      <Grid item>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.emocional}
              onChange={handleFilterChange}
              name="emocional"
            />
          }
          label="Emocional"
        />
      </Grid>
      <Grid item>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.academico}
              onChange={handleFilterChange}
              name="academico"
            />
          }
          label="Académico"
        />
      </Grid>
      <Grid item>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.uvinclusiva}
              onChange={handleFilterChange}
              name="uvinclusiva"
            />
          }
          label="UV Inclusiva (Neurodivergencia)"
        />
      </Grid>
      <Grid item>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.abuso}
              onChange={handleFilterChange}
              name="abuso"
            />
          }
          label="Violencia Física-Psicológica, Abuso"
        />
      </Grid>
      <Grid item>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.economicos}
              onChange={handleFilterChange}
              name="economicos"
            />
          }
          label="Económicos"
        />
      </Grid>
      <Grid item>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.emocionalYAcademico}
              onChange={handleFilterChange}
              name="emocionalYAcademico"
            />
          }
          label="Emocional y Académico"
        />
      </Grid>
      <Grid item>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.economicoEmocionalAcademico}
              onChange={handleFilterChange}
              name="economicoEmocionalAcademico"
            />
          }
          label="Económico, Emocional y Académico"
        />
      </Grid>
      <Grid item>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.economicoEmocional}
              onChange={handleFilterChange}
              name="economicoEmocional"
            />
          }
          label="Económico y Emocional"
        />
      </Grid>
      <Grid item>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.economicoAcademico}
              onChange={handleFilterChange}
              name="economicoAcademico"
            />
          }
          label="Económico y Académico"
        />
      </Grid>
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
            rows={students}
            columns={columns}
            getRowId={(row) => row._id}  // Use _id as the unique row identifier
            sx={{ height: '100%', width: '100%' }}  // Ensure DataGrid fills the container
          />
        </Paper>
      </Box>
      <Modal open={openModal} onClose={handleModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: '#ffffff', // White background for modal
            color: '#000000', // Black text color
            overflow: 'auto',
            padding: 4,
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            Información del Alumno
          </Typography>

          <Button variant="contained" color="primary" onClick={() => handleSubmit()}>
            Añadir Seguimiento a este alumno
          </Button>
          <FollowUpModal
            open={openModalFollowUp}
            onClose={() => setOpenModalFollowUp(false)}
            followUpData={followUpData}
            setFollowUpData={setFollowUpData}
            handleAddFollowUp={handleAddFollowUp}
          />
          {selectedStudent && (
            <>
              <TextField
                label="Nombre"
                value={selectedStudent.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                fullWidth
                margin="normal"
                sx={{ bgcolor: '#f9f9f9' }} // Light grey background for input fields
              />
              <TextField
                label="Segundo Nombre"
                value={selectedStudent.secondName || ''}
                onChange={(e) => handleChange('secondName', e.target.value)}
                fullWidth
                margin="normal"
                sx={{ bgcolor: '#f9f9f9' }}
              />
              <TextField
                label="Apellido Paterno"
                value={selectedStudent.fatherLastName || ''}
                onChange={(e) => handleChange('fatherLastName', e.target.value)}
                fullWidth
                margin="normal"
                sx={{ bgcolor: '#f9f9f9' }}
              />
              <TextField
                label="Apellido Materno"
                value={selectedStudent.motherLastName || ''}
                onChange={(e) => handleChange('motherLastName', e.target.value)}
                fullWidth
                margin="normal"
                sx={{ bgcolor: '#f9f9f9' }}
              />
              <TextField
                label="RUT"
                value={selectedStudent.rut || ''}
                onChange={(e) => handleChange('rut', e.target.value)}
                fullWidth
                margin="normal"
                sx={{ bgcolor: '#f9f9f9' }}
              />

              {/* Use black for typography and handle contrast for labels */}
              <Typography variant="h6" sx={{ color: '#000', marginTop: '3px', marginBottom: '3px' }}>Dígito Verificador</Typography>
              <Select
                label="DF"
                value={selectedStudent.df || ''}
                onChange={(e) => handleChange('df', e.target.value)}
                fullWidth
                margin="dense"
                sx={{ bgcolor: '#f9f9f9' }}
              >
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'K'].map((df) => (
                  <MenuItem key={df} value={df}>
                    {df}
                  </MenuItem>
                ))}
              </Select>

              <Typography variant="h6" sx={{ color: '#000', marginTop: '3px', marginBottom: '3px' }}>Semestre</Typography>
              <Select
                label="Semestre"
                value={selectedStudent.semester || ''}
                onChange={(e) => handleChange('semester', e.target.value)}
                fullWidth
                margin="dense"
                sx={{ bgcolor: '#f9f9f9' }}
              >
                {[
                  'Primer Semestre', 'Segundo Semestre', 'Tercer Semestre', 'Cuarto Semestre',
                  'Quinto Semestre', 'Sexto Semestre', 'Séptimo Semestre', 'Octavo Semestre',
                  'Noveno Semestre', 'Décimo Semestre'
                ].map((semester) => (
                  <MenuItem key={semester} value={semester}>
                    {semester}
                  </MenuItem>
                ))}
              </Select>

              <TextField
                label="Email"
                value={selectedStudent.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                fullWidth
                margin="normal"
                sx={{ bgcolor: '#f9f9f9' }}
              />
              <TextField
                label="Teléfono"
                value={selectedStudent.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                fullWidth
                margin="normal"
                sx={{ bgcolor: '#f9f9f9' }}
              />
              <TextField
                label="Ubicación"
                value={selectedStudent.location || ''}
                onChange={(e) => handleChange('location', e.target.value)}
                fullWidth
                margin="normal"
                sx={{ bgcolor: '#f9f9f9' }}
              />
              <FormControlLabel
                control={<Checkbox checked={selectedStudent.consumoSustancias || false} onChange={(e) => handleChange('consumoSustancias', e.target.checked)} />}
                label="Consumo Problemático de Sustancias"
              />
              {selectedStudent.consumoSustancias && (
                <TextField
                  label="Justificación"
                  value={selectedStudent.justConsumoSustancias || ''}
                  onChange={(e) => handleChange('justConsumoSustancias', e.target.value)}
                  fullWidth
                  margin="normal"
                  sx={{ bgcolor: '#f9f9f9' }}
                />
              )}

              {/* Checkbox and justification for "Convivencia y Buen Trato" */}
              <FormControlLabel
                control={<Checkbox checked={selectedStudent.convivencia || false} onChange={(e) => handleChange('convivencia', e.target.checked)} />}
                label="Convivencia y Buen Trato"
              />
              {selectedStudent.convivencia && (
                <TextField
                  label="Justificación"
                  value={selectedStudent.justConvivencia || ''}
                  onChange={(e) => handleChange('justConvivencia', e.target.value)}
                  fullWidth
                  margin="normal"
                  sx={{ bgcolor: '#f9f9f9' }}
                />
              )}

              {/* Checkbox and justification for "Emocional y Académico" */}
              <FormControlLabel
                control={<Checkbox checked={selectedStudent.emocionalYAcademico || false} onChange={(e) => handleChange('emocionalYAcademico', e.target.checked)} />}
                label="Emocional y Académico"
              />
              {selectedStudent.emocionalYAcademico && (
                <TextField
                  label="Justificación"
                  value={selectedStudent.justEmocionalYAcademico || ''}
                  onChange={(e) => handleChange('justEmocionalYAcademico', e.target.value)}
                  fullWidth
                  margin="normal"
                  sx={{ bgcolor: '#f9f9f9' }}
                />
              )}

              {/* Checkbox and justification for "Emocional" */}
              <FormControlLabel
                control={<Checkbox checked={selectedStudent.emocional || false} onChange={(e) => handleChange('emocional', e.target.checked)} />}
                label="Emocional"
              />
              {selectedStudent.emocional && (
                <TextField
                  label="Justificación"
                  value={selectedStudent.justEmocional || ''}
                  onChange={(e) => handleChange('justEmocional', e.target.value)}
                  fullWidth
                  margin="normal"
                  sx={{ bgcolor: '#f9f9f9' }}
                />
              )}

              {/* Checkbox and justification for "Académico" */}
              <FormControlLabel
                control={<Checkbox checked={selectedStudent.academico || false} onChange={(e) => handleChange('academico', e.target.checked)} />}
                label="Académico"
              />
              {selectedStudent.academico && (
                <TextField
                  label="Justificación"
                  value={selectedStudent.justAcademico || ''}
                  onChange={(e) => handleChange('justAcademico', e.target.value)}
                  fullWidth
                  margin="normal"
                  sx={{ bgcolor: '#f9f9f9' }}
                />
              )}

              {/* Checkbox and justification for "UV Inclusiva (Neurodivergencia)" */}
              <FormControlLabel
                control={<Checkbox checked={selectedStudent.uvinclusiva || false} onChange={(e) => handleChange('uvinclusiva', e.target.checked)} />}
                label="UV Inclusiva (Neurodivergencia)"
              />
              {selectedStudent.uvinclusiva && (
                <TextField
                  label="Justificación"
                  value={selectedStudent.justUvinclusiva || ''}
                  onChange={(e) => handleChange('justUvinclusiva', e.target.value)}
                  fullWidth
                  margin="normal"
                  sx={{ bgcolor: '#f9f9f9' }}
                />
              )}

              {/* Checkbox and justification for "Violencia Física-Psicológica, Abuso" */}
              <FormControlLabel
                control={<Checkbox checked={selectedStudent.abuso || false} onChange={(e) => handleChange('abuso', e.target.checked)} />}
                label="Violencia Física-Psicológica, Abuso"
              />
              {selectedStudent.abuso && (
                <TextField
                  label="Justificación"
                  value={selectedStudent.justAbuso || ''}
                  onChange={(e) => handleChange('justAbuso', e.target.value)}
                  fullWidth
                  margin="normal"
                  sx={{ bgcolor: '#f9f9f9' }}
                />
              )}

              {/* Checkbox and justification for "Económicos" */}
              <FormControlLabel
                control={<Checkbox checked={selectedStudent.economicos || false} onChange={(e) => handleChange('economicos', e.target.checked)} />}
                label="Económicos"
              />
              {selectedStudent.economicos && (
                <TextField
                  label="Justificación"
                  value={selectedStudent.justEconomicos || ''}
                  onChange={(e) => handleChange('justEconomicos', e.target.value)}
                  fullWidth
                  margin="normal"
                  sx={{ bgcolor: '#f9f9f9' }}
                />
              )}

              {/* Checkbox and justification for "Económico, Emocional y Académico" */}
              <FormControlLabel
                control={<Checkbox checked={selectedStudent.economicoEmocionalAcademico || false} onChange={(e) => handleChange('economicoEmocionalAcademico', e.target.checked)} />}
                label="Económico, Emocional y Académico"
              />
              {selectedStudent.economicoEmocionalAcademico && (
                <TextField
                  label="Justificación"
                  value={selectedStudent.justEconomicoEmocionalAcademico || ''}
                  onChange={(e) => handleChange('justEconomicoEmocionalAcademico', e.target.value)}
                  fullWidth
                  margin="normal"
                  sx={{ bgcolor: '#f9f9f9' }}
                />
              )}

              {/* Checkbox and justification for "Económico y Emocional" */}
              <FormControlLabel
                control={<Checkbox checked={selectedStudent.economicoEmocional || false} onChange={(e) => handleChange('economicoEmocional', e.target.checked)} />}
                label="Económico y Emocional"
              />
              {selectedStudent.economicoEmocional && (
                <TextField
                  label="Justificación"
                  value={selectedStudent.justEconomicoEmocional || ''}
                  onChange={(e) => handleChange('justEconomicoEmocional', e.target.value)}
                  fullWidth
                  margin="normal"
                  sx={{ bgcolor: '#f9f9f9' }}
                />
              )}

              {/* Checkbox and justification for "Económico y Académico" */}
              <FormControlLabel
                control={<Checkbox checked={selectedStudent.economicoAcademico || false} onChange={(e) => handleChange('economicoAcademico', e.target.checked)} />}
                label="Económico y Académico"
              />
              {selectedStudent.economicoAcademico && (
                <TextField
                  label="Justificación"
                  value={selectedStudent.justEconomicoAcademico || ''}
                  onChange={(e) => handleChange('justEconomicoAcademico', e.target.value)}
                  fullWidth
                  margin="normal"
                  sx={{ bgcolor: '#f9f9f9' }}
                />
              )}

              <Paper sx={{ mt: 4, p: 2 }}>
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6">Archivos Subidos</Typography>
                  {fileNames.length > 0 ? (
                    <ul>
                      {fileNames.map((fileName, index) => (
                        <>
                          <li key={index}>{fileName}</li>
                          <Button variant="contained" color="primary" onClick={() => handleDownload(fileName)}> Descargar </Button>
                        </>
                      ))}
                    </ul>
                  ) : (
                    <Typography variant="body2">No hay archivos subidos para este estudiante</Typography>
                  )}
                </Box>
                <Box>
                  <Typography variant="h6">Subir Archivos</Typography>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) {
                        setFiles(Array.from(files));
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleFileUpload(selectedStudent._id)}
                    sx={{ mt: 2 }}
                  >
                    Subir Archivos
                  </Button>

                </Box>
              </Paper>

              <Paper sx={{ mt: 4, p: 2 }}>
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6">Seguimientos Realizados</Typography>
                  {followUps.length > 0 ? (
                    followUps.map((followUp, index) => (
                      <Box key={followUp?._id || index} sx={{ mt: 2, p: 2, border: '1px solid #ccc' }}>
                        <Typography variant="body1">
                          <strong>#{index + 1}</strong> Fecha: {followUp?.date ? new Date(followUp.date).toLocaleDateString() : 'Fecha no disponible'}
                        </Typography>
                        <Typography variant="body1">Notas: {followUp?.notes || 'Notas no disponibles'}</Typography>

                        {/* Displaying the follow-up fields */}
                        <Typography variant="body1">
                          Asistenta Social: {followUp?.asistentaSocial ? 'Sí' : 'No'}
                        </Typography>
                        {followUp?.asistentaSocial && (
                          <Typography variant="body2">
                            Justificación: {followUp?.justAsistentaSocial || 'No especificado'}
                          </Typography>
                        )}

                        <Typography variant="body1">
                          Ajuste Académico: {followUp?.ajusteAcademico ? 'Sí' : 'No'}
                        </Typography>
                        {followUp?.ajusteAcademico && (
                          <Typography variant="body2">
                            Justificación: {followUp?.justAjusteAcademico || 'No especificado'}
                          </Typography>
                        )}

                        <Typography variant="body1">
                          Documento de Respaldo: {followUp?.documentoRespaldo ? 'Sí' : 'No'}
                        </Typography>
                        {followUp?.documentoRespaldo && (
                          <Typography variant="body2">
                            Justificación: {followUp?.justDocumentoRespaldo || 'No especificado'}
                          </Typography>
                        )}

                        <Typography variant="body1">
                          No Acepta Indicaciones: {followUp?.noAceptaIndicaciones ? 'Sí' : 'No'}
                        </Typography>
                        {followUp?.noAceptaIndicaciones && (
                          <Typography variant="body2">
                            Justificación: {followUp?.justNoAceptaIndicaciones || 'No especificado'}
                          </Typography>
                        )}

                        <Typography variant="body1">
                          Otro: {followUp?.otro || 'No especificado'}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2">No se han realizado seguimientos a este estudiante</Typography>
                  )}
                </Box>
              </Paper>


              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button onClick={handleUpdate} variant="contained" color="primary" sx={{ mr: 2 }}>
                  Modificar
                </Button>
                <Button onClick={handleModalClose} color="secondary">
                  Cerrar
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}

