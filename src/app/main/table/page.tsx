"use client";
import { Box, Button, Grid, Typography, TextField, Select, MenuItem, Paper, Modal, FormControlLabel, Checkbox } from "@mui/material";
import { useState } from 'react';
import axios from 'axios';
import FollowUpModal from '../components/followUpModals';
import { useAuth } from "../lib/auth";

export default function Table() {
  useAuth();
  const [studentData, setStudentData] = useState({
    consumoSustancias: false,
    justConsumoSustancias: '',
    convivencia: false,
    justConvivencia: '',
    emocionalYAcademico: false,
    justEmocionalYAcademico: '',
    emocional: false,
    justEmocional: '',
    academico: false,
    justAcademico: '',
    uvinclusiva: false,
    justUvinclusiva: '',
    abuso: false,
    justAbuso: '',
    economicos: false,
    justEconomicos: '',
    economicoEmocionalAcademico: false,
    justEconomicoEmocionalAcademico: '',
    economicoEmocional: false,
    justEconomicoEmocional: '',
    economicoAcademico: false,
    justEconomicoAcademico: '',
    rut: '',
    df: '',
    semester: '',
    email: '',
    phone: '',
    location: '',
    remedialAction: '',
    name: '',
    secondName: '',
    fatherLastName: '',
    motherLastName: '',
    sede: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [studentId, setStudentId] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [followUpData, setFollowUpData] = useState({
    date: '',
    notes: '',
    asistentaSocial: false,
    justAsistentaSocial: '',
    ajusteAcademico: false,
    justAjusteAcademico: '',
    documentoRespaldo: false,
    justDocumentoRespaldo: '',
    noAceptaIndicaciones: false,
    justNoAceptaIndicaciones: '',
    otro: ''
  });
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setStudentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: any) => {
    const { name, checked } = e.target;
    setStudentData((prev) => {
      const justificationField = `just${name.charAt(0).toUpperCase() + name.slice(1)}` as keyof typeof prev;
      return {
        ...prev,
        [name]: checked,
        [justificationField]: checked ? prev[justificationField] : 'none'
      };
    });
  };
  

  const handleJustificationChange = (e: any) => {
    const { name, value } = e.target;
    setStudentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (type: string) => {
    try {
      if (type === "add" || type === "addFollow") {
        const adjustedStudentData = {
          ...studentData,
          justConsumoSustancias: studentData.consumoSustancias ? studentData.justConsumoSustancias : 'none',
          justConvivencia: studentData.convivencia ? studentData.justConvivencia : 'none',
          justEmocionalYAcademico: studentData.emocionalYAcademico ? studentData.justEmocionalYAcademico : 'none',
          justEmocional: studentData.emocional ? studentData.justEmocional : 'none',
          justAcademico: studentData.academico ? studentData.justAcademico : 'none',
          justUvinclusiva: studentData.uvinclusiva ? studentData.justUvinclusiva : 'none',
          justAbuso: studentData.abuso ? studentData.justAbuso : 'none',
          justEconomicos: studentData.economicos ? studentData.justEconomicos : 'none',
          justEconomicoEmocionalAcademico: studentData.economicoEmocionalAcademico ? studentData.justEconomicoEmocionalAcademico : 'none',
          justEconomicoEmocional: studentData.economicoEmocional ? studentData.justEconomicoEmocional : 'none',
          justEconomicoAcademico: studentData.economicoAcademico ? studentData.justEconomicoAcademico : 'none'
        };

        const response = await axios.post('http://localhost:3000/api/student', adjustedStudentData);
        const studentId = response.data._id;
        if (files.length > 0) {
          await handleFileUpload(studentId);
        }
        setStudentData({
          consumoSustancias: false,
          justConsumoSustancias: '',
          convivencia: false,
          justConvivencia: '',
          emocionalYAcademico: false,
          justEmocionalYAcademico: '',
          emocional: false,
          justEmocional: '',
          academico: false,
          justAcademico: '',
          uvinclusiva: false,
          justUvinclusiva: '',
          abuso: false,
          justAbuso: '',
          economicos: false,
          justEconomicos: '',
          economicoEmocionalAcademico: false,
          justEconomicoEmocionalAcademico: '',
          economicoEmocional: false,
          justEconomicoEmocional: '',
          economicoAcademico: false,
          justEconomicoAcademico: '',
          rut: '',
          df: '',
          semester: '',
          email: '',
          phone: '',
          location: '',
          remedialAction: '',
          name: '',
          secondName: '',
          fatherLastName: '',
          motherLastName: '',
          sede: '',
        });
        setSelectedReason('');
        if (type === "addFollow") {
          setOpenModal(true);
          setStudentId(studentId);
        }
      }
      alert('Estudiante agregado correctamente');
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };



  const handleAddFollowUp = async () => {
    try {
      const followUpResponse = await axios.post('http://localhost:3000/api/student/add-follow-up', {
        id: studentId,
        follow_up: followUpData
      });
      setFollowUpData({ date: '', notes: '', asistentaSocial: false, justAsistentaSocial: '', ajusteAcademico: false, justAjusteAcademico: '', documentoRespaldo: false, justDocumentoRespaldo: '', noAceptaIndicaciones: false, justNoAceptaIndicaciones: '', otro: '' });
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
      setFiles([]);
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

            <Typography variant="h6" style={{ color: 'black', marginTop: '3px', marginBottom: '3px' }}>Motivos de Ingreso</Typography>

            {/** Consumo problemático de sustancias */}
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={studentData.consumoSustancias} onChange={handleCheckboxChange} name="consumoSustancias" />}
                label="Consumo Problemático de Sustancias"
              />
              {studentData.consumoSustancias && (
                <TextField
                  label="Justificación"
                  name="justConsumoSustancias"
                  value={studentData.justConsumoSustancias}
                  onChange={handleJustificationChange}
                  fullWidth
                  required
                />
              )}
            </Grid>

            {/** Convivencia y buen trato en la carrera */}
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={studentData.convivencia} onChange={handleCheckboxChange} name="convivencia" />}
                label="Convivencia y Buen Trato"
              />
              {studentData.convivencia && (
                <TextField
                  label="Justificación"
                  name="justConvivencia"
                  value={studentData.justConvivencia}
                  onChange={handleJustificationChange}
                  fullWidth
                  required
                />
              )}
            </Grid>

            {/** Emocional y académico */}
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={studentData.emocionalYAcademico} onChange={handleCheckboxChange} name="emocionalYAcademico" />}
                label="Emocional y Académico"
              />
              {studentData.emocionalYAcademico && (
                <TextField
                  label="Justificación"
                  name="justEmocionalYAcademico"
                  value={studentData.justEmocionalYAcademico}
                  onChange={handleJustificationChange}
                  fullWidth
                  required
                />
              )}
            </Grid>

            {/** Solo emocional */}
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={studentData.emocional} onChange={handleCheckboxChange} name="emocional" />}
                label="Solo Emocional"
              />
              {studentData.emocional && (
                <TextField
                  label="Justificación"
                  name="justEmocional"
                  value={studentData.justEmocional}
                  onChange={handleJustificationChange}
                  fullWidth
                  required
                />
              )}
            </Grid>

            {/** Solo académico */}
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={studentData.academico} onChange={handleCheckboxChange} name="academico" />}
                label="Solo Académico"
              />
              {studentData.academico && (
                <TextField
                  label="Justificación"
                  name="justAcademico"
                  value={studentData.justAcademico}
                  onChange={handleJustificationChange}
                  fullWidth
                  required
                />
              )}
            </Grid>

            {/** UV Inclusiva */}
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={studentData.uvinclusiva} onChange={handleCheckboxChange} name="uvinclusiva" />}
                label="UV Inclusiva (Neurodivergencia)"
              />
              {studentData.uvinclusiva && (
                <TextField
                  label="Justificación"
                  name="justUvinclusiva"
                  value={studentData.justUvinclusiva}
                  onChange={handleJustificationChange}
                  fullWidth
                  required
                />
              )}
            </Grid>

            {/** Violencia física-psicológica, abuso */}
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={studentData.abuso} onChange={handleCheckboxChange} name="abuso" />}
                label="Violencia Física-Psicológica, Abuso"
              />
              {studentData.abuso && (
                <TextField
                  label="Justificación"
                  name="justAbuso"
                  value={studentData.justAbuso}
                  onChange={handleJustificationChange}
                  fullWidth
                  required
                />
              )}
            </Grid>

            {/** Económicos */}
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={studentData.economicos} onChange={handleCheckboxChange} name="economicos" />}
                label="Económicos"
              />
              {studentData.economicos && (
                <TextField
                  label="Justificación"
                  name="justEconomicos"
                  value={studentData.justEconomicos}
                  onChange={handleJustificationChange}
                  fullWidth
                  required
                />
              )}
            </Grid>

            {/** Económico, emocional y académico */}
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={studentData.economicoEmocionalAcademico} onChange={handleCheckboxChange} name="economicoEmocionalAcademico" />}
                label="Económico, Emocional y Académico"
              />
              {studentData.economicoEmocionalAcademico && (
                <TextField
                  label="Justificación"
                  name="justEconomicoEmocionalAcademico"
                  value={studentData.justEconomicoEmocionalAcademico}
                  onChange={handleJustificationChange}
                  fullWidth
                  required
                />
              )}
            </Grid>

            {/** Económico y emocional */}
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={studentData.economicoEmocional} onChange={handleCheckboxChange} name="economicoEmocional" />}
                label="Económico y Emocional"
              />
              {studentData.economicoEmocional && (
                <TextField
                  label="Justificación"
                  name="justEconomicoEmocional"
                  value={studentData.justEconomicoEmocional}
                  onChange={handleJustificationChange}
                  fullWidth
                  required
                />
              )}
            </Grid>

            {/** Económico y académico */}
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={studentData.economicoAcademico} onChange={handleCheckboxChange} name="economicoAcademico" />}
                label="Económico y Académico"
              />
              {studentData.economicoAcademico && (
                <TextField
                  label="Justificación"
                  name="justEconomicoAcademico"
                  value={studentData.justEconomicoAcademico}
                  onChange={handleJustificationChange}
                  fullWidth
                  required
                />
              )}
            </Grid>
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
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      setFiles(Array.from(files));
                    }
                  }}
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
        <Modal open={openModal} onClose={() => setOpenModal(false)} aria-labelledby="follow-up-modal-title" aria-describedby="follow-up-modal-description">
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
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Notas"
              name="notes"
              value={followUpData.notes}
              onChange={(e) => setFollowUpData({ ...followUpData, notes: e.target.value })}
              fullWidth
              margin="normal"
            />
            {/* Additional fields for follow-up modal */}
            <FormControlLabel
              control={<Checkbox checked={followUpData.asistentaSocial} onChange={(e) => setFollowUpData({ ...followUpData, asistentaSocial: e.target.checked })} />}
              label="Asistenta Social"
            />
            {followUpData.asistentaSocial && (
              <TextField
                label="Justificación"
                name="justAsistentaSocial"
                value={followUpData.justAsistentaSocial}
                onChange={(e) => setFollowUpData({ ...followUpData, justAsistentaSocial: e.target.value })}
                fullWidth
                margin="normal"
              />
            )}
            <FormControlLabel
              control={<Checkbox checked={followUpData.ajusteAcademico} onChange={(e) => setFollowUpData({ ...followUpData, ajusteAcademico: e.target.checked })} />}
              label="Ajuste Académico"
            />
            {followUpData.ajusteAcademico && (
              <TextField
                label="Justificación"
                name="justAjusteAcademico"
                value={followUpData.justAjusteAcademico}
                onChange={(e) => setFollowUpData({ ...followUpData, justAjusteAcademico: e.target.value })}
                fullWidth
                margin="normal"
              />
            )}
            <FormControlLabel
              control={<Checkbox checked={followUpData.documentoRespaldo} onChange={(e) => setFollowUpData({ ...followUpData, documentoRespaldo: e.target.checked })} />}
              label="Documento de Respaldo"
            />
            {followUpData.documentoRespaldo && (
              <TextField
                label="Justificación"
                name="justDocumentoRespaldo"
                value={followUpData.justDocumentoRespaldo}
                onChange={(e) => setFollowUpData({ ...followUpData, justDocumentoRespaldo: e.target.value })}
                fullWidth
                margin="normal"
              />
            )}
            <FormControlLabel
              control={<Checkbox checked={followUpData.noAceptaIndicaciones} onChange={(e) => setFollowUpData({ ...followUpData, noAceptaIndicaciones: e.target.checked })} />}
              label="No Acepta Indicaciones"
            />
            {followUpData.noAceptaIndicaciones && (
              <TextField
                label="Justificación"
                name="justNoAceptaIndicaciones"
                value={followUpData.justNoAceptaIndicaciones}
                onChange={(e) => setFollowUpData({ ...followUpData, justNoAceptaIndicaciones: e.target.value })}
                fullWidth
                margin="normal"
              />
            )}
            <TextField
              label="Otro"
              name="otro"
              value={followUpData.otro}
              onChange={(e) => setFollowUpData({ ...followUpData, otro: e.target.value })}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleAddFollowUp} sx={{ mt: 2 }}>
              Añadir Seguimiento
            </Button>
          </Box>
        </Modal>
      </main>
      <FollowUpModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        followUpData={followUpData}
        setFollowUpData={setFollowUpData}
        handleAddFollowUp={handleAddFollowUp}
      />
    </Paper>
  );
}
