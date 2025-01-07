import React, { useState } from "react";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Cookies from "js-cookie";
import axios from 'axios';

interface FileWithPreview {
    file: File;
    id: string;
}

const FileUploadButton: React.FC = () => {
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files).map((file) => ({
                file,
                id: `${file.name}-${Date.now()}-${Math.random()}`, // Unique identifier
            }));
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        }
    };

    const handleDeleteFile = (id: string) => {
        setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    };

    const uploadFiles = async () => {
        if (files.length === 0) {
            alert("No files to upload!");
            return;
        }

        const formData = new FormData();
        files.forEach(({ file }) => {
            formData.append("documents", file);
        });

        setUploading(true);
        setUploadSuccess(null);
        console.log(files)
        try {
            await axios.post("http://localhost:3000/api/student/upload/documents", formData, {
                headers: {
                    Authorization: `${Cookies.get("xvlf")}`,
                    "Content-Type": "multipart/form-data",
                },
            });

        } catch (error) {
            setUploadSuccess("Error occurred during upload. Please try again.");
        } finally {
            setUploading(false);
            alert(`Archivos subidos correctamente`);
            setFiles([]);
        }
    };

    return (
        <div>
            <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                disabled={uploading}
            >
                Elegir archivos
                <input
                    type="file"
                    onChange={handleFileChange}
                    multiple
                    hidden
                />
            </Button>

            <div style={{ marginTop: "1rem" }}>
                {files.map(({ file, id }) => (
                    <div
                        key={id}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "0.5rem",
                            padding: "0.5rem",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                        }}
                    >
                        <span>{file.name}</span>
                        <IconButton
                            aria-label="delete"
                            color="error"
                            onClick={() => handleDeleteFile(id)}
                            disabled={uploading}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </div>
                ))}
            </div>

            <Button
                variant="contained"
                color="primary"
                onClick={uploadFiles}
                disabled={uploading || files.length === 0}
                style={{ marginTop: "1rem" }}
            >
                {uploading ? "Subiendo..." : "Subir todos los archivos"}
            </Button>

            {uploadSuccess && (
                <div style={{ marginTop: "1rem", color: uploadSuccess.includes("successfully") ? "green" : "red" }}>
                    {uploadSuccess}
                </div>
            )}
        </div>
    );
};

export default FileUploadButton;
