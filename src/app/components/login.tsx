import React from 'react'
import { Box, Button, Card, Grid, Paper, Typography } from "@mui/material";

export default async function Login() {
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

            <Typography>
              A continuación, ingrese con su correo institucional UV
            </Typography>
            <Button
              variant="contained"
              component="a"
              href="/auth/login"
            >
              Ingresar
            </Button>
          </Grid>
        </Paper>
      </Box>
    </main>
  )
}

