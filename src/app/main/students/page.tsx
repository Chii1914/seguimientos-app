'use client';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Box, Button, Typography, Menu, MenuItem, Modal, TextField, Paper, Select } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [followUps, setFollowUps] = useState([]); // State to store follow-ups
  const [fileNames, setFileNames] = useState([]); // State to store file names
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [menuAnchorEls, setMenuAnchorEls] = useState<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (selectedStudent) {
      const fetchFollowUps = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/student/${selectedStudent._id}/follow-ups`);
          setFollowUps(response.data);
          console.log(response.data)
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

    try {
      // Fetch file names for the selected student
      const response = await axios.get(`http://localhost:3000/api/student/${student._id}/filenames`);
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

  // Handle changes to text fields
  const handleChange = (key: string, value: string) => {
    setSelectedStudent((prev: any) => ({ ...prev, [key]: value }));
  };

  // Handle update request
  const handleUpdate = () => {
    if (!selectedStudent) return;

    // Destructure and remove _id, follow_ups, and __v
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
        const isMenuOpen = Boolean(menuAnchorEls[params.row._id]);

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
              onClick={(event) => handleMenuClick(event, params.row._id)}
            >
              Exportar
            </Button>
            <Menu
              id="demo-positioned-menu"
              anchorEl={menuAnchorEls[params.row._id]}
              open={isMenuOpen}
              onClose={() => handleMenuClose(params.row._id)}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <MenuItem onClick={() => handleMenuClose(params.row._id)}>Exportar a excel</MenuItem>
              <MenuItem onClick={() => handleMenuClose(params.row._id)}>Exportar a word</MenuItem>
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
        <Button>Exportar todos los estudiantes</Button>
        <Button>Exportar por rango de fecha</Button>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Paper>
          <DataGrid
            rows={students}
            columns={columns}
            disableSelectionOnClick
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
            bgcolor: 'background.paper',
            overflow: 'auto',
            padding: 4,
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            Información del Alumno
          </Typography>
          {selectedStudent && (
            <>
              <TextField
                label="Nombre"
                value={selectedStudent.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Segundo Nombre"
                value={selectedStudent.secondName || ''}
                onChange={(e) => handleChange('secondName', e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Apellido Paterno"
                value={selectedStudent.fatherLastName || ''}
                onChange={(e) => handleChange('fatherLastName', e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Apellido Materno"
                value={selectedStudent.motherLastName || ''}
                onChange={(e) => handleChange('motherLastName', e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="RUT"
                value={selectedStudent.rut || ''}
                onChange={(e) => handleChange('rut', e.target.value)}
                fullWidth
                margin="normal"
              />
              <Typography variant="h6" style={{ color: 'black', marginTop: '3px', marginBottom: '3px' }}>Dígito Verificador</Typography>
              <Select
                label="DF"
                value={selectedStudent.df || ''}
                onChange={(e) => handleChange('df', e.target.value)}
                fullWidth
                margin="normal"
              >
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'K'].map((df) => (
                  <MenuItem key={df} value={df}>
                    {df}
                  </MenuItem>
                ))}
              </Select>
              <Typography variant="h6" style={{ color: 'black', marginTop: '3px', marginBottom: '3px' }}>Semestre</Typography>

              <Select
                label="Semestre"
                value={selectedStudent.semester || ''}
                onChange={(e) => handleChange('semester', e.target.value)}
                fullWidth
                margin="normal"
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
              />
              <TextField
                label="Teléfono"
                value={selectedStudent.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Ubicación"
                value={selectedStudent.location || ''}
                onChange={(e) => handleChange('location', e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Carácter Académico"
                value={selectedStudent.academicCharacter || ''}
                onChange={(e) => handleChange('academicCharacter', e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Razón de Salud"
                value={selectedStudent.healthReason || ''}
                onChange={(e) => handleChange('healthReason', e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Razón Social"
                value={selectedStudent.socialReason || ''}
                onChange={(e) => handleChange('socialReason', e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Acción Remedial"
                value={selectedStudent.remedialAction || ''}
                onChange={(e) => handleChange('remedialAction', e.target.value)}
                fullWidth
                margin="normal"
              />
              <Typography variant="h6" style={{ color: 'black', marginTop: '3px', marginBottom: '3px' }}>Sede</Typography>
              <Select
                label="Sede"
                value={selectedStudent.sede || ''}
                onChange={(e) => handleChange('sede', e.target.value)}
                fullWidth
                margin="normal"
              >
                {['Valparaíso', 'Santiago', 'San Felipe'].map((sede) => (
                  <MenuItem key={sede} value={sede}>
                    {sede}
                  </MenuItem>
                ))}
              </Select>
              <Paper sx={{ mt: 4, p: 2 }}>
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6">Archivos Subidos</Typography>
                  {fileNames.length > 0 ? (
                    <ul>
                      {fileNames.map((fileName, index) => (
                        <li key={index}>{fileName}</li>
                      ))}
                    </ul>
                  ) : (
                    <Typography variant="body2">No hay archivos subidos para este estudiante</Typography>
                  )}
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

            </>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={handleUpdate} variant="contained" color="primary" sx={{ mr: 2 }}>
              Modificar
            </Button>
            <Button onClick={handleModalClose} color="secondary">
              Cerrar
            </Button>
          </Box>
        </Box>
      </Modal>



    </Box>
  );
}

