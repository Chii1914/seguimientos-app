"use client";
import { Box, Button, Grid, Typography, TextField, Select, MenuItem, Paper, Modal, FormControlLabel, Checkbox } from "@mui/material";
import { useState } from 'react';
import axios from 'axios';
import FollowUpModal from '../components/followUpModals';
import Cookies from "js-cookie";
import Swal from 'sweetalert2'
import __url from '../lib/const'
import FileUploadButton from "../lib/filesButton";

export default function Table() {
  const [openModal, setOpenModal] = useState(false);

  const [studentId, setStudentId] = useState({
    mail: ''
  })
//klaj
  const [studentData, setStudentData] = useState({
    mail: '',
    rut: 0,
    df: '',
    semester: 1,
    name: '',
    phone: 0,
    secondName: '',
    fatherLastName: '',
    motherLastName: '',
    sede: '',
    verified: false,
    remedialAction: ''
  })

  const [motivesData, setMotivesData] = useState({
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
    uvInclusiva: false,
    justUvInclusiva: '',
    abuso: false,
    justAbuso: '',
    economico: false,
    justEconomico: '',
    economicoEmocionalAcademico: false,
    justEconomicoEmocionalAcademico: '',
    economicoEmocional: false,
    justEconomicoEmocional: '',
    economicoAcademico: false,
    justEconomicoAcademico: ''
  });

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
    setStudentData((prev) => {
      let formattedValue = value;
      if (name === 'rut' || name === 'phone') {
        formattedValue = parseInt(value, 10);
      }
      return { ...prev, [name]: formattedValue };
    });
  };


  const handleCheckboxChange = (e: any) => {
    const { name, checked } = e.target;
    setMotivesData((prev) => {
      const justificationField = `just${name.charAt(0).toUpperCase() + name.slice(1)}` as keyof typeof prev;
      return {
        ...prev,
        [name]: checked,
        [justificationField]: checked ? prev[justificationField] : ''
      };
    });
  };

  const handleJustificationChange = (e: any) => {
    const { name, value } = e.target;
    setMotivesData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (type: string) => {
    try {
      const newStudent = await axios.post(`${__url}/student/initialform`, {
        student: studentData,
        motive: motivesData
      }, { headers: { Authorization: `${Cookies.get('xvlf')}` } });
      Swal.fire({
        toast: true,
        title: `Estudiante ${studentData.name} ${studentData.fatherLastName}`,
        text: 'Estudiante añadido correctamente',
        icon: 'success',
        confirmButtonText: 'ok'
      });
      if (type === 'addFollow') {
        setStudentId(newStudent.data.mail)
        setOpenModal(true);
      }
      setMotivesData({
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
        uvInclusiva: false,
        justUvInclusiva: '',
        abuso: false,
        justAbuso: '',
        economico: false,
        justEconomico: '',
        economicoEmocionalAcademico: false,
        justEconomicoEmocionalAcademico: '',
        economicoEmocional: false,
        justEconomicoEmocional: '',
        economicoAcademico: false,
        justEconomicoAcademico: ''
      })
      setStudentData({
        mail: '',
        rut: 0,
        df: '',
        semester: 2,
        name: '',
        phone: 0,
        secondName: '',
        fatherLastName: '',
        motherLastName: '',
        sede: '',
        verified: false,
        remedialAction: ''
      })
    }
    catch (err) {
      Swal.fire({
        toast: true,
        title: `Error`,
        text: 'No se ha añadido el estudiante',
        icon: 'error',
        confirmButtonText: 'ok'
      });
      console.error(err)
    }

  }

  const handleAddFollowUp = async () => {
    try {
      const followUpResponse = await axios.post(`${__url}/student/add-follow-up`, {

        follow_up: followUpData
      });
      setFollowUpData({ date: '', notes: '', asistentaSocial: false, justAsistentaSocial: '', ajusteAcademico: false, justAjusteAcademico: '', documentoRespaldo: false, justDocumentoRespaldo: '', noAceptaIndicaciones: false, justNoAceptaIndicaciones: '', otro: '' });
      setOpenModal(false);
      setStudentId({ mail: '' });
    } catch (error) {
      console.error('Error adding follow-up:', error);
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
                type="tel"
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}

              />
            </Grid>
            <Typography variant="h6" style={{ color: 'black', marginTop: '3px', marginBottom: '3px' }}>Dígito Verificador</Typography>
            <Grid item xs={12}>
              <Select
                label="Dígito verificador"
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
                {[
                  { label: 'Primer Semestre', value: "1" },
                  { label: 'Segundo Semestre', value: "2" },
                  { label: 'Tercer Semestre', value: "3" },
                  { label: 'Cuarto Semestre', value: "4" },
                  { label: 'Quinto Semestre', value: "5" },
                  { label: 'Sexto Semestre', value: "6" },
                  { label: 'Séptimo Semestre', value: "7" },
                  { label: 'Octavo Semestre', value: "8" },
                  { label: 'Noveno Semestre', value: "9" },
                  { label: 'Décimo Semestre', value: "10" }
                ].map((semester) => (
                  <MenuItem key={semester.value} value={semester.value}>{semester.label}</MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email institucional del alumno"
                name="mail"
                value={studentData.mail}
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
                type="tel"
                fullWidth
                required
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              />
            </Grid>
            <Typography variant="h6" style={{ color: 'black', marginTop: '3px', marginBottom: '3px' }}>Motivos de Ingreso</Typography>

            {/** Consumo problemático de sustancias */}
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={motivesData.consumoSustancias} onChange={handleCheckboxChange} name="consumoSustancias" />}
                label="Consumo Problemático de Sustancias"
              />
              {motivesData.consumoSustancias && (
                <TextField
                  label="Justificación"
                  name="justConsumoSustancias"
                  value={motivesData.justConsumoSustancias}
                  onChange={handleJustificationChange}
                  fullWidth
                  required
                />
              )}
            </Grid>

            {/** Convivencia y buen trato en la carrera */}
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={motivesData.convivencia} onChange={handleCheckboxChange} name="convivencia" />}
                label="Convivencia y Buen Trato"
              />
              {motivesData.convivencia && (
                <TextField
                  label="Justificación"
                  name="justConvivencia"
                  value={motivesData.justConvivencia}
                  onChange={handleJustificationChange}
                  fullWidth
                  required
                />
              )}
            </Grid>

            {/** Emocional y académico */}
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={motivesData.emocionalYAcademico} onChange={handleCheckboxChange} name="emocionalYAcademico" />}
                label="Emocional y Académico"
              />
              {motivesData.emocionalYAcademico && (
                <TextField
                  label="Justificación"
                  name="justEmocionalYAcademico"
                  value={motivesData.justEmocionalYAcademico}
                  onChange={handleJustificationChange}
                  fullWidth
                  required
                />
              )}
            </Grid>

            {/** Solo emocional */}
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={motivesData.emocional} onChange={handleCheckboxChange} name="emocional" />}
                label="Solo Emocional"
              />
              {motivesData.emocional && (
                <TextField
                  label="Justificación"
                  name="justEmocional"
                  value={motivesData.justEmocional}
                  onChange={handleJustificationChange}
                  fullWidth
                  required
                />
              )}
            </Grid>

            {/** Solo académico */}
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={motivesData.academico} onChange={handleCheckboxChange} name="academico" />}
                label="Solo Académico"
              />
              {motivesData.academico && (
                <TextField
                  label="Justificación"
                  name="justAcademico"
                  value={motivesData.justAcademico}
                  onChange={handleJustificationChange}
                  fullWidth
                  required
                />
              )}
            </Grid>

            {/** UV Inclusiva */}
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={motivesData.uvInclusiva} onChange={handleCheckboxChange} name="uvInclusiva" />}
                label="UV Inclusiva (Neurodivergencia)"
              />
              {motivesData.uvInclusiva && (
                <TextField
                  label="Justificación"
                  name="justUvInclusiva"
                  value={motivesData.justUvInclusiva}
                  onChange={handleJustificationChange}
                  fullWidth
                  required
                />
              )}
            </Grid>

            {/** Violencia física-psicológica, abuso */}
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={motivesData.abuso} onChange={handleCheckboxChange} name="abuso" />}
                label="Violencia Física-Psicológica, Abuso"
              />
              {motivesData.abuso && (
                <TextField
                  label="Justificación"
                  name="justAbuso"
                  value={motivesData.justAbuso}
                  onChange={handleJustificationChange}
                  fullWidth
                  required
                />
              )}
            </Grid>

            {/** Económicos */}
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={motivesData.economico} onChange={handleCheckboxChange} name="economico" />}
                label="Económicos"
              />
              {motivesData.economico && (
                <TextField
                  label="Justificación"
                  name="justEconomico"
                  value={motivesData.justEconomico}
                  onChange={handleJustificationChange}
                  fullWidth
                  required
                />
              )}
            </Grid>

            {/** Económico, emocional y académico */}
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={motivesData.economicoEmocionalAcademico} onChange={handleCheckboxChange} name="economicoEmocionalAcademico" />}
                label="Económico, Emocional y Académico"
              />
              {motivesData.economicoEmocionalAcademico && (
                <TextField
                  label="Justificación"
                  name="justEconomicoEmocionalAcademico"
                  value={motivesData.justEconomicoEmocionalAcademico}
                  onChange={handleJustificationChange}
                  fullWidth
                  required
                />
              )}
            </Grid>

            {/** Económico y emocional */}
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={motivesData.economicoEmocional} onChange={handleCheckboxChange} name="economicoEmocional" />}
                label="Económico y Emocional"
              />
              {motivesData.economicoEmocional && (
                <TextField
                  label="Justificación"
                  name="justEconomicoEmocional"
                  value={motivesData.justEconomicoEmocional}
                  onChange={handleJustificationChange}
                  fullWidth
                  required
                />
              )}
            </Grid>

            {/** Económico y académico */}
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={motivesData.economicoAcademico} onChange={handleCheckboxChange} name="economicoAcademico" />}
                label="Económico y Académico"
              />
              {motivesData.economicoAcademico && (
                <TextField
                  label="Justificación"
                  name="justEconomicoAcademico"
                  value={motivesData.justEconomicoAcademico}
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
                <FileUploadButton email={studentData.mail} />
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