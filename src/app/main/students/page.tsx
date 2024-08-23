"use client";
import { Box, Button, Card, Grid, Paper, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React from "react";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';


export default function Students() {

  const students = [
    { name: 'Alice', semester: '5th', numberIdentity: '123456' },
    { name: 'Bob', semester: '6th', numberIdentity: '789012' },
    { name: 'Charlie', semester: '4th', numberIdentity: '345678' },
  ];

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedStudent, setSelectedStudent] = React.useState<{ name: string; semester: string; numberIdentity: string } | null>(null);
  const [openDialog, setOpenDialog] = React.useState(false);

  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDialogOpen = (student: any) => {
    setSelectedStudent(student);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedStudent(null);
  };

  return (
    <>
      <Box>
        <Button>Exportar todos los estudiantes</Button>
        <Button>Exportar por rango de fecha</Button>
      </Box>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Semestre</TableCell>
                <TableCell>RUT</TableCell>
                <TableCell>Acciones</TableCell>
                <TableCell width="100px">Exportar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student, index) => (
                <TableRow key={index}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.semester}</TableCell>
                  <TableCell>{student.numberIdentity}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleDialogOpen(student)}>
                      Ver Alumno
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      id="demo-positioned-button"
                      aria-controls={openMenu ? 'demo-positioned-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={openMenu ? 'true' : undefined}
                      onClick={handleMenuClick}
                    >
                      Exportar
                    </Button>
                    <Menu
                      id="demo-positioned-menu"
                      aria-labelledby="demo-positioned-button"
                      anchorEl={anchorEl}
                      open={openMenu}
                      onClose={handleMenuClose}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                    >
                      <MenuItem onClick={handleMenuClose}>Exportar a excel</MenuItem>
                      <MenuItem onClick={handleMenuClose}>Exportar a word</MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </main>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Información del Alumno</DialogTitle>
        <DialogContent>
          {selectedStudent && (
            <>
              <Typography>Nombre: {selectedStudent.name}</Typography>
              <Typography>Semestre: {selectedStudent.semester}</Typography>
              <Typography>RUT: {selectedStudent.numberIdentity}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
