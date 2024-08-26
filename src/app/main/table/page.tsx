"use client";
import { Box, Button, Grid, Typography, TextField, Select, MenuItem, Paper } from "@mui/material";
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

  const [selectedReason, setSelectedReason] = useState(''); // State to store the selected reason type

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

        setSelectedReason(''); 

        if (type === "addFollow") {
          console.log("Estudiante añadido y añadir seguimiento");
        }
      }
    } catch (error) {
      console.error('Error adding student:', error);
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
            {/* Conditional inputs based on selected reason */}
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
        </Box>
      </main>
    </Paper>
  );
}
