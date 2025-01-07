"use client";

import { useState } from "react";
import axios from "axios";
import { useAuth } from "@/app/main/lib/auth";
import Cookies from "js-cookie";
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import FileUploadButton from "@/app/main/lib/filesButton";

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

  // State to hold the consent checkbox value
  const [consent, setConsent] = useState(false);

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

  const handleSubmit = async () => {
    // Check if both photos are uploaded
    if (photos.some((photoState) => photoState.photo === null)) {
      alert("Please upload both photos.");
      return;
    }

    // Check if consent is given
    if (!consent) {
      alert("Debes aceptar el consentimiento para subir el consentimiento para las fotografías");
      return;
    }

    // Prepare the FormData
    const formData = new FormData();
    const fileInputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;

    fileInputs.forEach((input, index) => {
      if (input.files && input.files[0]) {
        const fieldName = index === 0 ? 'anverso' : 'reverso';
        formData.append(fieldName, input.files[0]);
      }
    });

    // Send the request to the backend using axios
    try {
      const response = await axios.post(`http://localhost:3000/api/student/identificacion`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `${Cookies.get("xvlf")}`,
        },
      });

      if (response.status === 201) {
        alert("Fotos subidas correctamente");
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error uploading photos:", error);
    }
  };

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
                    No se ha subido ninguna foto
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
                  {photoState.photo ? "Cambiar foto" : "Subir foto"}
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
        <FormControlLabel
          control={
            <Checkbox
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              color="primary"
            />
          }
          label="Acepto que mis datos sean almacenados para las futuras entrevistas de acuerdo a lo conversado"
        />
      </Box>
      <Box mt={4}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSubmit}
          disabled={photos.some((photoState) => photoState.photo === null)}
        >
          Subir fotografías
        </Button>
      </Box>
      <Box mt={4} className="text-center">
       <Typography variant="h4" className="text-center" gutterBottom>
          Documentos solicitados por el entrevistador
        </Typography>
        <FileUploadButton email={''}/>
      </Box>
    </main>
  );
}
