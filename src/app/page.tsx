"use client";
import { Box, Button, Card, Grid, Paper, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import Image from "next/image";
import url from "./main/lib/const";

export default function Home() {
  const [uwu, setUwu] = useState<any[]>([])
  
  const Router = useRouter();
  const login = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  }

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,

  }));
  
  useEffect(() => {
    axios.get(`${url}/student/uwu`)
      .then(response => {
        setUwu(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }); 
   return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Box>
        <Paper className="p-8">
          <Grid container direction="column" justifyContent="flex-end" alignItems="stretch">
            <Typography
              variant="h4"
              className="text-center"
            >
              Sistema de seguimientos académicos uv
            </Typography>
            <h1>
              {uwu ? uwu : ':c'}
            </h1>
            <Typography>
              A continuación, ingrese con su correo institucional UV
            </Typography>
            <Button variant="contained" onClick={login}>
              Ingresar
            </Button>
          </Grid>
        </Paper>
      </Box>
    </main>
  );
}
