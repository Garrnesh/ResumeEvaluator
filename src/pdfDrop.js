import React, { useCallback, useState, useEffect, createContext, useContext, } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import pdfImage from './pdf.png';

const PdfContext = createContext();

function PdfDrop() {
    const [pdfBase64, setpdfBase64] = useState('');
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const onDrop = useCallback((updatedFiles) => {
        const pdfFile = updatedFiles[0];
        if (pdfFile){
            const reader = new FileReader();
            reader.onload = () => {
                const res = reader.result
                const base64Str = res.split(',')[1];
                setpdfBase64(base64Str);
                navigate(`/evaluate?pdfBase64=${encodeURIComponent(base64Str)}`);
        };
        reader.readAsDataURL(pdfFile);
    }
    }, [navigate]);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop, accept:'application/pdf'});

    useEffect(() => {
        if (isDragActive) {
          setMessage("Drop the PDF here");
        } else {
          setMessage("Drag and drop your Resume PDF file here, or click to select one");
        }
      }, [isDragActive]);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Resume Evaluator</h1>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    backgroundColor: '#f7f7f7'
                }}
            >
                <div
                    {...getRootProps()}
                    style={{
                    border: '2px dashed #cccccc',
                    borderRadius: '5px',
                    width: '300px',
                    padding: '20px',
                    backgroundColor: '#fff',
                    textAlign: 'center'
                    }}
                >
                    <input {...getInputProps()} />
                    <img
                        src={pdfImage}
                        alt="Dropzone icon"
                        style={{
                        width: '100px',
                        height: '100px',
                        margin: '0 auto',
                        }}
                    />
                    <p>{message}</p>
                </div>
            </div>
        </div>
    );
};

export default PdfDrop;