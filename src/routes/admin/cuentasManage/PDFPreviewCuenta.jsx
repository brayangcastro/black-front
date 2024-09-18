import React, { useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Worker, Viewer } from '@react-pdf-viewer/core';

const PDFPreviewCuenta = ({ pdfUrl, show, handleClose }) => {
    useEffect(() => {
        const loadWorker = async () => {
            const pdfjsLib = await import('pdfjs-dist/build/pdf');
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        };

        loadWorker();
    }, []);

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Vista Previa del PDF</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{ height: '750px' }}>
                    <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js">
                        <Viewer fileUrl={pdfUrl} />
                    </Worker>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PDFPreviewCuenta;
