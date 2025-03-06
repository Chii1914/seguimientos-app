'use client';
import React, { useState, useEffect } from "react";
import { SelectChangeEvent } from '@mui/material';
import { useAuth } from "../lib/auth";
import axios from 'axios';
import { Box, Button, Typography, Menu, MenuItem, Modal, TextField, Paper, Select, Checkbox, FormControlLabel, Table, Grid, CardContent } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import FollowUpModal from "../components/followUpModals";
import __url from "../lib/const";
import Cookies from "js-cookie";
import FileUploadButton from "../lib/filesButton";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Swal from "sweetalert2";
import { InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";



interface FileData {
  documentFiles: string[];
  carnetFiles: string[];
}

export default function Students() {
  const [searchQuery, setSearchQuery] = useState("");

  const [fileData, setFileData] = useState<FileData>({ documentFiles: [], carnetFiles: [] });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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
    uvInclusiva: false,
    abuso: false,
    economico: false,
    emocionalYAcademico: false,
    economicoEmocionalAcademico: false,
    economicoEmocional: false,
    economicoAcademico: false,
    state: 'all'
  });
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase()); // Normalize search query
  };
  useEffect(() => {
    const filtered = students.filter((student) => {
      return (
        student.name.toLowerCase().includes(searchQuery) ||
        student.secondName.toLowerCase().includes(searchQuery) ||
        student.fatherLastName.toLowerCase().includes(searchQuery) ||
        student.motherLastName.toLowerCase().includes(searchQuery)
      );
    });

    setFilteredStudents(filtered);
  }, [searchQuery, students]);


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
    timestamp: '',
    notes: '',
    asistentaSocial: false,
    justAsistentaSocial: '',
    ajusteAcademico: false,
    justAjusteAcademico: '',
    documentosRespaldo: false,
    justDocumentosRespaldo: '',
    noAceptaIndicaciones: false,
    justNoAceptaIndicaciones: '',
    otro: '',
  });

  /* Quizás not fetchear los follow ups */
  /*
   useEffect(() => {
     if (selectedStudent) {
       const fetchFollowUps = async () => {
         try {
           const response = await axios.get(`${__url}/${selectedStudent._id}/follow-ups`);
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
   */

  useEffect(() => {
    axios.get(`${__url}/student/motives`, { headers: { Authorization: `${Cookies.get('xvlf')}` } })
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
      const response = await axios.get(`${__url}/follow-up/${studentId}`, { headers: { Authorization: `${Cookies.get('xvlf')}` } });
      setFollowUps(response.data);
    } catch (error) {
      console.error('Error fetching follow-ups:', error);
    }
  };

  const handleDownload = async (filename: string, category: string) => {
    try {
      // Construct the endpoint URL
      const endpoint = `${__url}/student/download/${selectedStudent.mail}/${filename}/${category}`;

      // Make a GET request to the backend with the correct responseType
      const response = await axios.get(endpoint, { headers: { Authorization: `${Cookies.get('xvlf')}` }, responseType: 'json' });

      if (response.data && response.data.file && Array.isArray(response.data.file.data)) {
        // Convert the array of numbers (Buffer) to a Uint8Array
        const fileBuffer = new Uint8Array(response.data.file.data);

        // Create a Blob from the Uint8Array (binary data)
        const fileBlob = new Blob([fileBuffer]);

        // Create a URL for the Blob
        const url = window.URL.createObjectURL(fileBlob);

        // Create an anchor element to trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', response.data.filename); // Use the filename from the response

        // Trigger the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

      } else {
        console.error('Invalid response format:', response.data);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleDelete = async (filename: string, category: string) => {
    // Show the SweetAlert confirmation before displaying any modals
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
      backdrop: true, // Optional: Makes background darker while Swal is visible
      willOpen: () => {
        // Optional: Can set z-index higher to ensure it's on top
        const swalContainer = document.querySelector('.swal2-container');
        if (swalContainer) {
          (swalContainer as HTMLElement).style.zIndex = '999999';  // Higher than most modals
        }
      }
    });

    if (result.isConfirmed) {
      try {
        const endpoint = `${__url}/student/delete/${selectedStudent.mail}/${filename}/${category}`;
        await axios.delete(endpoint, { headers: { Authorization: `${Cookies.get('xvlf')}` }, responseType: 'json' });

        Swal.fire({
          title: '¡Borrado!',
          text: 'El archivo ha sido borrado.',
          icon: 'success',
          willOpen: () => {
            // Optional: Can set z-index higher to ensure it's on top
            const swalContainer = document.querySelector('.swal2-container');
            if (swalContainer) {
              (swalContainer as HTMLElement).style.zIndex = '999999';  // Higher than most modals
            }
          }
        });
        fetchFileNames(selectedStudent.mail); // Refresh the file list
      } catch (error) {
        console.error('Error deleting file:', error);
        Swal.fire(
          'Error',
          'Hubo un problema al borrar el archivo.',
          'error'
        );
      }
    }
  };


  const handleAddFollowUp = async () => {

    if (!selectedStudent) return;

    try {
      await axios.post(`${__url}/follow-up/${selectedStudent.mail}`, { followUpData }, { headers: { Authorization: `${Cookies.get('xvlf')}` } });
      Swal.fire({
        icon: 'success',
        title: 'Seguimiento añadido correctamente',
        showConfirmButton: false,
        timer: 1500
      });
      setOpenModalFollowUp(false);
      setFollowUpData({
        timestamp: '',
        notes: '',
        asistentaSocial: false,
        justAsistentaSocial: '',
        ajusteAcademico: false,
        justAjusteAcademico: '',
        documentosRespaldo: false,
        justDocumentosRespaldo: '',
        noAceptaIndicaciones: false,
        justNoAceptaIndicaciones: '',
        otro: '',
      });
      fetchFollowUps(selectedStudent.mail);
    } catch (error) {
      console.error('Error adding follow-up:', error);
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
    fetchFollowUps(student.mail);
    setSelectedStudent(student);
    setOpenModal(true);
    fetchFileNames(student.mail);
  };

  const fetchFileNames = async (studentMail: string) => {
    try {
      const response = await axios.get(`${__url}/student/filenames/${studentMail}`, {
        headers: {
          Authorization: `${Cookies.get('xvlf')}`,
        }
      });
      setFileData(response.data);
    } catch (error) {
      console.error('Error fetching file names:', error);
    }
    setLoading(false);
  };


  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedStudent(null);
    setFileData({ documentFiles: [], carnetFiles: [] });
  };

  // Handle changes to text fields and checkboxes
  const handleChange = (key: string, value: string | boolean) => {
    setSelectedStudent((prev: any) => ({ ...prev, [key]: value }));
  };

  // Handle update request
  const handleUpdate = async () => {
    if (!selectedStudent) return;
    try {

      await axios.patch(`${__url}/student/motives/${selectedStudent.mail}`, selectedStudent, { headers: { Authorization: `${Cookies.get('xvlf')}` } });
      setReload(!reload);
      Swal.fire({
        icon: 'success',
        title: 'Alumno actualizado correctamente',
        showConfirmButton: false,
        timer: 1500
      });
      handleModalClose();
    } catch (error) {
      console.error('Error updating student:', error);
    }

  };
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, student: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student);
  };
  const handleStateChange = async (newState: boolean) => {
    if (!selectedStudent) return;

    try {
      await axios.patch(`${__url}/student/${selectedStudent._id}`, {
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
              checked={filters.uvInclusiva}
              onChange={handleFilterChange}
              name="uvInclusiva"
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
              checked={filters.economico}
              onChange={handleFilterChange}
              name="economico"
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
        <TextField
          label="Buscar alumno"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ marginBottom: 2 }}
        />
        <Paper elevation={3}>
          <DataGrid
            rows={filteredStudents}
            columns={columns}
            getRowId={(row) => row.mail}  // Use _id as the unique row identifier
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
          <Button onClick={() => handleModalClose()}> Dejar de ver a este alumno </Button>

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
                  { value: '1', label: 'Primer Semestre' },
                  { value: '2', label: 'Segundo Semestre' },
                  { value: '3', label: 'Tercer Semestre' },
                  { value: '4', label: 'Cuarto Semestre' },
                  { value: '5', label: 'Quinto Semestre' },
                  { value: '6', label: 'Sexto Semestre' },
                  { value: '7', label: 'Séptimo Semestre' },
                  { value: '8', label: 'Octavo Semestre' },
                  { value: '9', label: 'Noveno Semestre' },
                  { value: '10', label: 'Décimo Semestre' }
                ].map((semester) => (
                  <MenuItem key={semester.value} value={semester.value}>
                    {semester.label}
                  </MenuItem>
                ))}
              </Select>

              <TextField
                label="Email"
                value={selectedStudent.mail || ''}
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
              <Typography variant="h6" sx={{ color: '#000', marginTop: '3px', marginBottom: '3px' }}>Ubicación</Typography>
              <Select
                label="Ubicación"
                value={selectedStudent.sede || ''}
                onChange={(e) => handleChange('sede', e.target.value)}
                fullWidth
                margin="dense"
                sx={{ bgcolor: '#f9f9f9' }}
              >
                <MenuItem value="Valparaíso">Valparaíso</MenuItem>
                <MenuItem value="Santiago">Santiago</MenuItem>
                <MenuItem value="San Felipe">San Felipe</MenuItem>
              </Select>
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
                control={<Checkbox checked={selectedStudent.uvInclusiva || false} onChange={(e) => handleChange('uvInclusiva', e.target.checked)} />}
                label="UV Inclusiva (Neurodivergencia)"
              />
              {selectedStudent.uvInclusiva && (
                <TextField
                  label="Justificación"
                  value={selectedStudent.justUvInclusiva || ''}
                  onChange={(e) => handleChange('justUvInclusiva', e.target.value)}
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
                control={<Checkbox checked={selectedStudent.economico || false} onChange={(e) => handleChange('economico', e.target.checked)} />}
                label="Económicos"
              />
              {selectedStudent.economico && (
                <TextField
                  label="Justificación"
                  value={selectedStudent.justEconomico || ''}
                  onChange={(e) => handleChange('justEconomico', e.target.value)}
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
                  <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                      Archivos del alumno
                    </Typography>
                    {loading ? (
                      <Typography variant="body2">Cargando archivos...</Typography>
                    ) : error ? (
                      <Typography variant="body2" color="error">
                        {error}
                      </Typography>
                    ) : (
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell><strong>Tipo</strong></TableCell>
                              <TableCell><strong>Archivo</strong></TableCell>
                              <TableCell><strong>Acciones</strong></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {Object.entries(fileData).map(([category, files]) =>
                              Array.isArray(files) ? (
                                files.map((filename: string, index: number) => (
                                  <TableRow key={`${category}-${filename}-${index}`}>
                                    <TableCell>{category === "documentos" ? "Documento" : <strong>Carnet</strong>}</TableCell>
                                    <TableCell>{filename}</TableCell>
                                    <TableCell>
                                      <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handleDownload(filename, category)}
                                      >
                                        Descargar
                                      </Button>

                                      <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => handleDelete(filename, category)}
                                      >
                                        Borrar
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow key={category}>
                                  <TableCell colSpan={3} style={{ textAlign: 'center' }}>
                                    No se encontraron archivos del alumno.
                                  </TableCell>
                                </TableRow>
                              )
                            )}

                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </CardContent>
                </Box>
                <Box>
                  <Typography variant="h6">Subir Archivos</Typography>
                  <FileUploadButton email={selectedStudent.mail} />
                </Box>
              </Paper>

              <Paper sx={{ mt: 4, p: 2 }}>
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6">Seguimientos Realizados</Typography>
                  {followUps.length > 0 ? (
                    followUps.map((followUp, index) => (
                      <Box key={followUp?.timestamp || index} sx={{ mt: 2, p: 2, border: '1px solid #ccc' }}>
                        <Typography variant="body1">
                          <strong>#{index + 1}</strong> Fecha: {followUp?.timestamp ? new Date(followUp.timestamp).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Fecha no disponible'}
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
                          Documento de Respaldo: {followUp?.documentosRespaldo ? 'Sí' : 'No'}
                        </Typography>
                        {followUp?.documentosRespaldo && (
                          <Typography variant="body2">
                            Justificación: {followUp?.justDocumentosRespaldo || 'No especificado'}
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

