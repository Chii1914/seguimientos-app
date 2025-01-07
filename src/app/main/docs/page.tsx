"use client";
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { styled } from '@mui/material/styles';
import React, { useState, useEffect } from "react";
import { SelectChangeEvent } from '@mui/material';
import axios from 'axios';
import { Box, Button, Typography, Menu, MenuItem, Modal, TextField, Paper, Select, Checkbox, FormControlLabel, Grid, Card, CardActions, CardContent } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Verified } from '@mui/icons-material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileUploadButton from '../lib/filesButton';
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Cookies from "js-cookie";
export default function Students() {

  const [students, setStudents] = useState<any[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [followUps, setFollowUps] = useState<any[]>([]); // State to store follow-ups
  const [fileNames, setFileNames] = useState([]); // State to store file names
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openModalFollowUp, setOpenModalFollowUp] = useState(false);
  const [studentMail, setStudentMail] = useState('');
  const [menuAnchorEls, setMenuAnchorEls] = useState<Record<string, HTMLElement | null>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [reload, setReload] = useState(false); // State to trigger re-fetch
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    verified: 'all'
  });
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
  /*useEffect(() => {
    // Datos simulados para prueba
    const mockStudents = [
      {
        mail: "1",
        fatherLastName: "Pérez",
        motherLastName: "Gómez",
        name: "Juan",
        secondName: "Carlos",
        semester: "2",
        rut: "12345678-9",
        state: true,
      },
      {
        mail: "2",
        fatherLastName: "López",
        motherLastName: "Martínez",
        name: "Ana",
        secondName: "María",
        semester: "4",
        rut: "98765432-1",
        state: true,

      },
    ];
    setStudents(mockStudents);
    setFilteredStudents(mockStudents);
  }, []);*/

  useEffect(() => {
    axios.get('http://localhost:3000/api/student')
      .then(response => {
        setStudents(response.data);

      })
      .catch(error => {
        console.error('Error fetching students:', error);
      });
  }, [reload]);


  const fetchFileNames = async (studentMail: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/student/${studentMail}/filenames`);
      setFileNames(response.data);
    } catch (error) {
      console.error('Error fetching file names:', error);
    }
  };

  const fetchFiles = async () => {
    try {
      await axios.get("http://localhost:3000/api/student/filenames", {
        headers: {
          Authorization: `${Cookies.get('xvlf')}`, // Replace with the actual token
        },
      });
    } catch (err) {
      alert("Failed to fetch files. Please try again.");
    } 
  };

  // Manejador para cambios en el filtro
  const handleFilterChange = (
    event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target as HTMLInputElement | { name: string; value: string };
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Efecto para filtrar estudiantes
  useEffect(() => {
    const filtered = students.filter((student) => {
      if (filters.verified === 'all') {
        return true; // Mostrar todos
      }
      if (filters.verified === 'true') {
        return student.verified === 1;
      }
      if (filters.verified === 'false') {
        return student.verified === 0;
      }
      return true;
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


  /*useEffect(() => {
    if (selectedStudent) {
      const fetchFollowUps = async () => {
        try {
          const response = await axios.get(`http://localhost:6969/api/student/${selectedStudent.mail}/follow-ups`);
          setFollowUps(response.data);
        } catch (error) {
          console.error('Error fetching follow-ups:', error);
        }
      };

      fetchFollowUps();
    } else {
      setFollowUps([]); 
    }
  }, [selectedStudent]);*/


  const handleStateChange = async (student: Object, state: boolean) => {
    setSelectedStudent(student);

    try {
      const response = await axios.patch(`http://localhost:3000/api/student/verify`, {
        mail: selectedStudent.mail,
        verified: state
      }, {
        headers: { Authorization: `${Cookies.get("xvlf")}` }
      });
      setReload(!reload);
      alert(`Estado administrativo de ${selectedStudent.fatherLastName} actualizado correctamente`);
      handleMenuClose("");
    } catch (error) {
      console.error("Error updating student status:", error);
    }
  };

  const handleDocumentRequest = async () => {
    if (!selectedStudent) return;
    const message = document.getElementById('message') as HTMLInputElement;
    if (!message) { alert("Debe proporcionar un mensaje"); return; }
    try {
      await axios.post(`http://localhost:3000/api/student/document`, {
        mail: selectedStudent.mail,
        message: message.value
      }, {
        headers: { Authorization: `${Cookies.get("xvlf")}` }
      });
      setOpenModal(false);
      alert(`Solicitud de documentos enviada a ${selectedStudent.mail} correctamente`);
      handleClose();
    } catch (error) {
      console.error("Error requesting documents:", error);
    }


  }

  const handleSubmit = () => {
    setOpenModalFollowUp(true);
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, studentMail: string) => {
    setMenuAnchorEls((prev) => ({ ...prev, [studentMail]: event.currentTarget }));
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, student: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student);
  };

  const handleMenuClose = (studentMail: string) => {
    setMenuAnchorEls((prev) => ({ ...prev, [studentMail]: null }));
    setAnchorEl(null);

  };

  const handleModalOpen = async (student: any) => {
    setSelectedStudent(student);
    setOpenModal(true);
    fetchFileNames(student.mail);
  };

  const handleFileUpload = async (studentMail: string) => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      await axios.post(`http://localhost:3000/api/student/files/${studentMail}`, formData);
      fetchFileNames(studentMail);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  }

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
      width: 200,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Box display="flex" gap={1}>
            {/* Botón para validar */}
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                handleStateChange(params.row, true);
              }}
              size="small"
              startIcon={<CheckCircleIcon />}
            >
              {/* Texto opcional */}
            </Button>

            {/* Botón para eliminar */}
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleStateChange(params.row, false);
              }}
              size="small"
              startIcon={<CancelIcon />}
            >
              {/* Texto opcional */}
            </Button>

            {/* Botón para pedir otro documento */}
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleOpen();
                setSelectedStudent(params.row);
                handleFileUpload(params.row);
              }}
              size="small"
              startIcon={<DescriptionIcon />} // Ícono representativo para documentos
            >
              {/* Texto opcional */}
            </Button>
          </Box>
        );
      },
      sortable: false,
      filterable: false,
    },
  ];



  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">



      <Grid item>
        <FormControlLabel
          control={
            <Select
              name="verified"
              value={filters.verified}
              onChange={handleFilterChange}
              displayEmpty
            >
              <MenuItem value='all'>Todos</MenuItem>
              <MenuItem value='true'>Verificado</MenuItem>
              <MenuItem value='false'>No verificado</MenuItem>

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
            getRowId={(row) => row.mail}  // Use mail as the unique row identifier
            sx={{ height: '100%', width: '100%' }}  // Ensure DataGrid fills the container
          />
        </Paper>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {selectedStudent ? `Subir documentos o solicitar para el alumno ${selectedStudent.fatherLastName} ${selectedStudent.motherLastName}, ${selectedStudent.name} ${selectedStudent.secondName}` : 'Subir documentos'}
          </Typography>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Solicitar documento
              </Typography>
              <TextField id='message' label='Ingrese su mensaje' variant='outlined'></TextField>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => handleDocumentRequest()}>Enviar</Button>
            </CardActions>
          </Card>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Subir documento
              </Typography>
              <FileUploadButton />
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => handleDocumentRequest()}>Enviar</Button>
            </CardActions>
          </Card>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Archivos del alumno
              </Typography>

            </CardContent>
          </Card>
        </Box>
      </Modal>
    </main>
  )

}
