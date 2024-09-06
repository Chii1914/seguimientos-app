'use client';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Box, Button, Typography, Menu, MenuItem, Modal, TextField, Paper, Select, Checkbox, FormControlLabel } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import FollowUpModal from "../components/followUpModals";
export default function Students() {
  const [students, setStudents] = useState<any[]>([]);
  const [followUps, setFollowUps] = useState<any[]>([]); // State to store follow-ups
  const [fileNames, setFileNames] = useState([]); // State to store file names
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openModalFollowUp, setOpenModalFollowUp] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [menuAnchorEls, setMenuAnchorEls] = useState<Record<string, HTMLElement | null>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [followUpData, setFollowUpData] = useState({
    date: '',
    notes: ''
  });


  useEffect(() => {
    if (selectedStudent) {
      const fetchFollowUps = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/student/${selectedStudent._id}/follow-ups`);
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
    axios.get('http://localhost:3000/api/student')
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error('Error fetching students:', error);
      });
  }, []);

  const fetchFollowUps = async (studentId: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/student/${studentId}/follow-ups`);
      setFollowUps(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching follow-ups:', error);
    }
  };


  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, studentId: string) => {
    setMenuAnchorEls((prev) => ({ ...prev, [studentId]: event.currentTarget }));
  };

  const handleMenuClose = (studentId: string) => {
    setMenuAnchorEls((prev) => ({ ...prev, [studentId]: null }));
  };

  const handleModalOpen = async (student: any) => {
    setSelectedStudent(student);
    setOpenModal(true);
    fetchFileNames(student._id);
  };

  const fetchFileNames = async (studentId: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/student/${studentId}/filenames`);
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

    axios.patch(`http://localhost:3000/api/student/${_id}`, studentData)
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
                      <Box key={followUp._id} sx={{ mt: 2, p: 2, border: '1px solid #ccc' }}>
                        <Typography variant="body1">
                          <strong>#{index + 1}</strong> Fecha: {new Date(followUp.date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body1">Notas: {followUp.notes}</Typography>
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

