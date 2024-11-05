"use client";
import { Box, Button, Card, Grid, Paper, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import { useAuth } from "../lib/auth";
export default function Reports() {
  useAuth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Typography
              variant="h1"
              className="text-center"
            >
             usuarios
            </Typography>
    </main>
  );
}