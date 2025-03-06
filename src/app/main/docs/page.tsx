"use client";
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { styled } from '@mui/material/styles';
import React, { useState, useEffect } from "react";
import { SelectChangeEvent } from '@mui/material';
import axios from 'axios';
import { Box, Button, Typography, Menu, MenuItem, Modal, TextField, Paper, Select, Table, Checkbox, FormControlLabel, Grid, Card, CardActions, CardContent } from "@mui/material";
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
import { headers } from 'next/headers';
import __url from '../lib/const';
import Swal from 'sweetalert2';
interface FileData {
  documentFiles: string[];
  carnetFiles: string[];
}

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
  const [searchQuery, setSearchQuery] = useState<string>("");

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
  const [fileData, setFileData] = useState<FileData>({ documentFiles: [], carnetFiles: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
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

  useEffect(() => {
    axios.get(`${__url}/student`, { headers: { Authorization: `${Cookies.get('xvlf')}` } })
      .then(response => {
        setStudents(response.data);

      })
      .catch(error => {
        console.error('Error fetching students:', error);
      });
  }, [reload]);

  useEffect(() => {
    const filtered = students.filter((student) => {
      const fullName = `${student.name} ${student.fatherLastName} ${student.motherLastName}`.toLowerCase();
      return (
        (filters.verified === "all" ||
          (filters.verified === "true" && student.verified === 1) ||
          (filters.verified === "false" && student.verified === 0)) &&
        fullName.includes(searchQuery.toLowerCase())
      );
    });
    setFilteredStudents(filtered);
  }, [filters, students, searchQuery]);

  const fetchFileNames = async (studentMail: string) => {
    try {
      const response = await axios.get(`${__url}/student/${studentMail}/filenames`);
      setFileNames(response.data);
    } catch (error) {
      console.error('Error fetching file names:', error);
    }
  };

  const fetchFiles = async (studentMail: string) => {
    try {
      await axios.get(`${__url}/student/filenames`, {
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


  const handleStateChange = async (student: { mail: string, fatherLastName: string, name: string }, state: boolean) => {
    try {
      await axios.patch(`${__url}/student/verify`, {
        mail: student.mail,
        verified: state
      }, {
        headers: { Authorization: `${Cookies.get("xvlf")}` }
      });
      setReload(!reload);
      alert(`Estado administrativo de ${student.name} ${student.fatherLastName} actualizado correctamente`);
      handleMenuClose("");
    } catch (error) {
      console.error("Error updating student status:", error);
    }
  };
  const handleDocumentRequest = async () => {
    if (!selectedStudent) return;

    const message = document.getElementById('message') as HTMLInputElement;
    if (message.value == '' || message.value == null) {
      handleClose();
      Swal.fire({
        icon: 'warning',
        title: '¡Ups!',
        text: 'Debe proporcionar un mensaje.',

      });
      return;
    }
    const loadingSwal = Swal.fire({
      title: 'Enviando solicitud...',
      text: 'Estamos enviando tu solicitud. Esto puede tomar unos segundos.',
      imageWidth: 100,
      imageHeight: 100,
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // Show loading animation
      }
    });


    try {
      handleClose();
      await axios.post(`${__url}/student/document`, {
        mail: selectedStudent.mail,
        message: message.value
      }, {
        headers: { Authorization: `${Cookies.get("xvlf")}` }
      });


      setOpenModal(false);
      // Success message with SweetAlert
      Swal.fire({
        icon: 'success',
        title: '¡Solicitud Enviada!',
        text: `Solicitud de documentos enviada a ${selectedStudent.mail} correctamente`,
      });

      handleClose();
    } catch (error) {
      console.error("Error requesting documents:", error);
      // Error message with SweetAlert
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Hubo un problema al enviar la solicitud de documentos. Por favor, intente de nuevo.',
      });
    }
  }
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
    handleOpen()
    try {
      const response = await axios.get(`${__url}/student/filenames/${student.mail}`, {
        headers: {
          Authorization: `${Cookies.get('xvlf')}`,
        }
      });
      console.log(response.data)
      setFileData(response.data);
    } catch (error) {
      console.error('Error fetching file data:', error);
      setFileData({ documentFiles: [], carnetFiles: [] });
    }
    setLoading(false);
  };


  const handleFileUpload = async (studentMail: string) => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      await axios.post(`${__url}/student/files/${studentMail}`, formData);
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
      width: 220,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Box display="flex" gap={1}>
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
                handleModalOpen(params.row);
                handleFileUpload(params.row.mail);
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
      <Grid container spacing={2} alignItems="center" justifyContent="space-between">
        {/* Search Bar */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Buscar por nombre o apellido"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Grid>

        {/* Filter Dropdown */}
        <Grid item xs={12} sm={6}>
          <Select
            name="verified"
            value={filters.verified}
            onChange={handleFilterChange}
            displayEmpty
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="true">Verificado</MenuItem>
            <MenuItem value="false">No verificado</MenuItem>
          </Select>
        </Grid>
      </Grid>

      <Box sx={{ flexGrow: 1 }}>
        <Paper elevation={3}>
          <DataGrid
            rows={filteredStudents}
            columns={columns}
            getRowId={(row) => row.mail}
            sx={{ height: "100%", width: "100%" }}
          />
        </Paper>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%', // Make width responsive
            maxHeight: '90vh', // Limit height to 90% of viewport
            overflowY: 'auto', // Enable vertical scrolling
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >          <Typography id="modal-modal-title" variant="h6" component="h2">
            {selectedStudent ? `Subir documentos o solicitar para el alumno ${selectedStudent.fatherLastName} ${selectedStudent.motherLastName}, ${selectedStudent.name} ${selectedStudent.secondName}` : 'Subir documentos'}
          </Typography>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Solicitar documento via email, escribalos a continuación
              </Typography>

              <TextField id='message' label='Ingrese los documentos.' variant='outlined'></TextField>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => handleDocumentRequest()}>Enviar solicitud</Button>
            </CardActions>
          </Card>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Subir documento
              </Typography>
              {selectedStudent?.mail ? (
                <FileUploadButton email={selectedStudent.mail} />
              ) : (
                <Typography color="error">Selecciona un estudiante para subir documentos.</Typography>
              )}
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => handleDocumentRequest()}>Enviar</Button>
            </CardActions>
          </Card>
          <Card sx={{ minWidth: 275 }}>
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
          </Card>
        </Box>
      </Modal>
    </main>
  )

}
