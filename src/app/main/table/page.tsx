"use client";
import { Box, Button, Grid, Typography, TextField, Select, MenuItem, Paper, Modal } from "@mui/material";
import { useState } from 'react';
import axios from 'axios';

export default function Table() {
  const [studentData, setStudentData] = useState({
    rut: '',
    df: '',
    semester: '',
    email: '',
    phone: '',
    location: '',
    academicCharacter: '',
    healthReason: '',
    socialReason: '',
    remedialAction: '',
    name: '',
    secondName: '',
    fatherLastName: '',
    motherLastName: '',
    sede: '',
  });
  const [files, setFiles] = useState([]); // State to store selected files

  const [studentId, setStudentId] = useState(''); // State to store the student ID
  const [selectedReason, setSelectedReason] = useState('');
  const [openModal, setOpenModal] = useState(false); // State to control modal visibility
  const [followUpData, setFollowUpData] = useState({ // State to store follow-up data
    date: '',
    notes: ''
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setStudentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReasonChange = (e: any) => {
    const value = e.target.value;
    setSelectedReason(value);

    // Set all reason fields to "none" initially
    setStudentData((prev) => ({
      ...prev,
      academicCharacter: 'none',
      healthReason: 'none',
      socialReason: 'none',
      [value]: '' // Clear the selected field to allow user input
    }));
  };

  const handleSubmit = async (type: string) => {
    try {
      if (type === "add" || type === "addFollow") {
        const response = await axios.post('http://localhost:3000/api/student', studentData);
        console.log('Student added successfully:', response.data);

        // Store the student ID from the response
        const studentId = response.data._id;

        // Check if there are files to upload
        if (files.length > 0) {
          await handleFileUpload(studentId);
        }

        // Reset form after adding the student
        setStudentData({
          rut: '',
          df: '',
          semester: '',
          email: '',
          phone: '',
          location: '',
          academicCharacter: '',
          healthReason: '',
          socialReason: '',
          remedialAction: '',
          name: '',
          secondName: '',
          fatherLastName: '',
          motherLastName: '',
          sede: '',
        });

        setSelectedReason(''); // Reset the selected reason

        if (type === "addFollow") {
          setOpenModal(true); // Open the modal for adding follow-up
          setStudentId(studentId); // Store the student ID in state for later use
        }
      }
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };



  const handleAddFollowUp = async () => {
    try {
      // Use the stored student ID to add the follow-up
      const followUpResponse = await axios.post('http://localhost:3000/api/student/add-follow-up', {
        id: studentId, // Use the stored student ID
        follow_up: followUpData // Follow-up data
      });

      console.log('Follow-up added successfully:', followUpResponse.data);

      // Reset follow-up data and close modal
      setFollowUpData({ date: '', notes: '' });
      setOpenModal(false);
    } catch (error) {
      console.error('Error adding follow-up:', error);
    }
  };
  const handleFileUpload = async (studentId: string) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file)); // Append each selected file to the form data

    try {
      const uploadResponse = await axios.post(`http://localhost:3000/api/student/files/${studentId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Files uploaded successfully:', uploadResponse.data);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  return (
    <Paper>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Typography variant="h4" style={{ color: 'black', marginTop: '3px', marginBottom: '3px' }}>Añadir Alumno</Typography>
        <Box component="form" sx={{ mt: 4, width: '100%', maxWidth: '600px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="RUT"
                name="rut"
                value={studentData.rut}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Typography variant="h6" style={{ color: 'black', marginTop: '3px', marginBottom: '3px' }}>Dígito Verificador</Typography>
            <Grid item xs={12}>
              <Select
                label="DF"
                name="df"
                value={studentData.df}
                onChange={handleChange}
                fullWidth
                required
              >
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'K'].map((df) => (
                  <MenuItem key={df} value={df}>{df}</MenuItem>
                ))}
              </Select>
            </Grid>
            <Typography variant="h6" style={{ color: 'black', marginTop: '3px', marginBottom: '3px' }}>Semestre</Typography>
            <Grid item xs={12}>
              <Select
                label="Semestre"
                name="semester"
                value={studentData.semester}
                onChange={handleChange}
                fullWidth
                required
              >
                {['Primer Semestre', 'Segundo Semestre', 'Tercer Semestre', 'Cuarto Semestre', 'Quinto Semestre', 'Sexto Semestre', 'Séptimo Semestre', 'Octavo Semestre', 'Noveno Semestre', 'Décimo Semestre'].map((semester) => (
                  <MenuItem key={semester} value={semester}>{semester}</MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                value={studentData.email}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Teléfono"
                name="phone"
                value={studentData.phone}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Ubicación"
                name="location"
                value={studentData.location}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Typography variant="h4" style={{ color: 'black', marginTop: '3px', marginBottom: '3px' }}>Motivo</Typography>
            <Grid item xs={12}>
              <Select
                label="Seleccionar Motivo"
                value={selectedReason}
                onChange={handleReasonChange}
                fullWidth
              >
                <MenuItem value="">Seleccionar Motivo</MenuItem>
                <MenuItem value="academicCharacter">Carácter Académico</MenuItem>
                <MenuItem value="healthReason">Razón de Salud</MenuItem>
                <MenuItem value="socialReason">Razón Social</MenuItem>
              </Select>
            </Grid>
            {selectedReason === 'academicCharacter' && (
              <Grid item xs={12}>
                <TextField
                  label="Carácter Académico"
                  name="academicCharacter"
                  value={studentData.academicCharacter}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
            )}
            {selectedReason === 'healthReason' && (
              <Grid item xs={12}>
                <TextField
                  label="Razón de Salud"
                  name="healthReason"
                  value={studentData.healthReason}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
            )}
            {selectedReason === 'socialReason' && (
              <Grid item xs={12}>
                <TextField
                  label="Razón Social"
                  name="socialReason"
                  value={studentData.socialReason}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                label="Acción Remedial"
                name="remedialAction"
                value={studentData.remedialAction}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nombre"
                name="name"
                value={studentData.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Segundo Nombre"
                name="secondName"
                value={studentData.secondName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Apellido Paterno"
                name="fatherLastName"
                value={studentData.fatherLastName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Apellido Materno"
                name="motherLastName"
                value={studentData.motherLastName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Typography variant="h6" style={{ color: 'black', marginTop: '3px', marginBottom: '3px' }}>Sede</Typography>
            <Grid item xs={12}>
              <Select
                label="Sede"
                name="sede"
                value={studentData.sede}
                onChange={handleChange}
                fullWidth
                required
              >
                {['Valparaíso', 'Santiago', 'San Felipe'].map((sede) => (
                  <MenuItem key={sede} value={sede}>{sede}</MenuItem>
                ))}
              </Select>
              <Grid item xs={12}>
                <Typography variant="h6" style={{ color: 'black', marginTop: '3px', marginBottom: '3px' }}>Certificados</Typography>
                <p>En este apartado podrá subir archivos que respalden la situación del estudiante</p>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFiles(Array.from(e.target.files))}
                />
              </Grid>

              <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={() => handleSubmit("add")}>
                  Agregar Estudiante
                </Button>
                <Button variant="contained" color="primary" onClick={() => handleSubmit("addFollow")}>
                  Agregar Estudiante y añadir un seguimiento
                </Button>
              </Grid>

            </Grid>
            
          </Grid>
        </Box>
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
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
            <Typography id="follow-up-modal-title" variant="h6" component="h2">
              Añadir Seguimiento
            </Typography>
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
            <TextField
              label="Notas"
              name="notes"
              value={followUpData.notes}
              onChange={(e) => setFollowUpData({ ...followUpData, notes: e.target.value })}
              fullWidth
              margin="normal"
            />
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
      </main>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
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
          <TextField
            label="Notas"
            name="notes"
            value={followUpData.notes}
            onChange={(e) => setFollowUpData({ ...followUpData, notes: e.target.value })}
            fullWidth
            margin="normal"
          />
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
    </Paper>
  );
}
