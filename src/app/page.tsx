"use client";
import { Box, Button, Card, Grid, Paper, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import __url from "./main/lib/const";
import { useAccessToken } from './context/TokenContext';
import { useUser } from "@auth0/nextjs-auth0";
import axios from "axios";


export default function Home() {

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,

  }));


  const { user, isLoading } = useUser();
  const token = useAccessToken();
  const router = useRouter();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  async function handleLogin() {
    try {

      const response = await axios.get(`${__url}/user/validate/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response.data);
      
      if (response.data?.user === 'admin') {
        router.push("/main");
      } if (response.data?.user === 'student') {
        router.push("/student");
      }


    } catch (error) {
      console.error("Login error:", error);
    }
  }
  return (
    <>
      <title>Confirmación de usuario</title>
      <meta name="description" content="Confirme su identidad para acceder al sistema de seguimientos académicos UV." />
      {isLoading && <p>Loading...</p>}
      {user && (
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

                <Typography>
                  Confirme que usted es la siguiente persona:
                </Typography>
                <Card>
                  <Typography variant="h6" className="text-center">
                    {user.name}
                  </Typography>
                  <Typography className="text-center">
                    {user.email}
                  </Typography>
                </Card>
                <Button
                  variant="contained"
                  onClick={() => handleLogin()}
                >
                  Confirmar
                </Button>
              </Grid>
            </Paper>
          </Box>
        </main>
      )}
    </>
  );
}
