// src/components/QRScanner.jsx
import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import '../styles/QRScanner.css';

const QRScanner = () => {
    const [scanResult, setScanResult] = useState(null);
    const [scanner, setScanner] = useState(null);

    useEffect(() => {
        // Función para manejar el éxito del escaneo
        const onScanSuccess = (decodedText, decodedResult) => {
            try {
                const productData = JSON.parse(decodedText);
                setScanResult(productData);
                if (scanner) {
                    scanner.clear();
                }
            } catch (error) {
                console.error("Error al parsear el código QR:", error);
                setScanResult({ error: "Formato de QR no válido" });
            }
        };

        // Función para manejar errores
        const onScanError = (error) => {
            console.warn(error);
        };

        // Limpiar cualquier instancia previa del escáner
        const existingElement = document.getElementById("qr-reader");
        if (existingElement) {
            existingElement.innerHTML = '';
        }

        // Inicializar el escáner con configuración actualizada
        const html5QrcodeScanner = new Html5QrcodeScanner(
            "qr-reader",
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
                showTorchButtonIfSupported: true,
                hideScanner: false,
                rememberLastUsedCamera: true
            },
            false
        );

        html5QrcodeScanner.render(onScanSuccess, onScanError);
        setScanner(html5QrcodeScanner);

        return () => {
            if (scanner) {
                scanner.clear();
            }
        };
    }, []);

    return (
        <div className="qr-scanner-container">
            <header className="scanner-header">
                <h1>Escáner de Ventas</h1>
            </header>

            <main className="scanner-main">
                <div id="qr-reader-wrapper">
                    <div id="qr-reader"></div>
                </div>

                {scanResult && (
                    <div className="result-container">
                        <h2>Producto escaneado:</h2>
                        <div className="product-details">
                            <p><strong>SKU:</strong> {scanResult.sku}</p>
                            <p><strong>Código de lote:</strong> {scanResult.batchCode}</p>
                            <p><strong>Nombre del producto:</strong> {scanResult.productName}</p>
                            <p><strong>Fecha de fabricación:</strong> {scanResult.manufacturingDate}</p>
                            <p><strong>Fecha de vencimiento:</strong> {scanResult.expirationDate}</p>
                        </div>
                    </div>
                )}
            </main>

            <footer className="scanner-footer">
                <p>&copy; 2024 Tu Empresa</p>
            </footer>
        </div>
    );
};

export default QRScanner;