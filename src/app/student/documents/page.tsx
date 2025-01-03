"use client";

import { useState } from "react";
import { useAuth } from "@/app/main/lib/auth";
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { styled } from "@mui/material/styles";

interface PhotoState {
  photo: string | null;
}

export default function Reports() {
  useAuth();

  // State to hold the uploaded photos
  const [photos, setPhotos] = useState<PhotoState[]>([
    { photo: null },
    { photo: null },
  ]);

  const handlePhotoUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectURL = URL.createObjectURL(file);
      setPhotos((prevPhotos) => {
        const updatedPhotos = [...prevPhotos];
        updatedPhotos[index].photo = objectURL;
        return updatedPhotos;
      });
    }
  };

  const labels = ["Foto carnet anverso", "Foto carnet reverso"];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Typography variant="h4" className="text-center" gutterBottom>
        Verficación y consentimiento del alumno
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {photos.map((photoState, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Typography variant="subtitle1" gutterBottom>
              {labels[index]}
            </Typography>
            <Card>
              {photoState.photo ? (
                <CardMedia
                  component="img"
                  alt={`Uploaded Photo ${index + 1}`}
                  height="200"
                  image={photoState.photo}
                />
              ) : (
                <CardContent>
                  <Typography variant="body1" color="textSecondary">
                    No se a subido ninguna foto
                  </Typography>
                </CardContent>
              )}
              <CardContent>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  color="primary"
                >
                  {photoState.photo ? "Change Photo" : "Upload Photo"}
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    hidden
                    onChange={(e) => handlePhotoUpload(e, index)}
                  />
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box mt={4}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => console.log("Photos:", photos)}
          disabled={photos.some((photoState) => photoState.photo === null)}
        >
          Submit Photos
        </Button>
      </Box>
    </main>
  );
}
