// src/components/QRScanner.jsx
import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import '../styles/QRScanner.css';

const QRScanner = () => {
    const [scanResult, setScanResult] = useState(null);
    const [scanner, setScanner] = useState(null);
    const [error, setError] = useState(null);
    const [scanHistory, setScanHistory] = useState([]);
    const [isScanning, setIsScanning] = useState(true);

    useEffect(() => {
        initializeScanner();
        return () => {
            if (scanner) {
                scanner.clear();
            }
        };
    }, []);

    const initializeScanner = () => {
        const onScanSuccess = (decodedText, decodedResult) => {
            try {
                const productData = JSON.parse(decodedText);
                const scanData = {
                    ...productData,
                    timestamp: new Date().toISOString(),
                };
                setScanResult(scanData);
                setScanHistory(prev => [scanData, ...prev]);
                setError(null);

                // Play success sound
                const audio = new Audio('/success-beep.mp3');
                audio.play().catch(e => console.log('Audio play failed:', e));

                if (scanner) {
                    setIsScanning(false);
                    scanner.pause();
                }
            } catch (error) {
                setError("Formato de QR no válido");
                console.error("Error al parsear el código QR:", error);
            }
        };

        const onScanError = (error) => {
            console.warn(error);
        };

        const existingElement = document.getElementById("qr-reader");
        if (existingElement) {
            existingElement.innerHTML = '';
        }

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
    };

    const resetScanner = () => {
        setScanResult(null);
        setError(null);
        setIsScanning(true);
        if (scanner) {
            scanner.resume();
        }
    };

    const exportToCSV = () => {
        if (scanHistory.length === 0) return;

        const headers = ['SKU', 'Código de lote', 'Nombre del producto', 'Fecha de fabricación',
            'Fecha de vencimiento', 'Fecha de escaneo'];
        const csvRows = [
            headers.join(','),
            ...scanHistory.map(item => [
                item.sku,
                item.batchCode,
                `"${item.productName}"`,
                item.manufacturingDate,
                item.expirationDate,
                new Date(item.timestamp).toLocaleString()
            ].join(','))
        ];

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `escaneos_${new Date().toISOString().slice(0,10)}.csv`;
        link.click();
    };

    return (
        <div className="qr-scanner-container">
            <header className="scanner-header">
                <h1>Escáner de Ventas - JPDevs</h1>
            </header>

            <main className="scanner-main">
                {error && (
                    <div className="error-alert">
                        {error}
                    </div>
                )}

                <div className="scanner-content">
                    <div className="scanner-card">
                        <div id="qr-reader-wrapper">
                            <div id="qr-reader"></div>
                        </div>
                    </div>

                    {scanResult && (
                        <div className="result-card">
                            <h2>Producto escaneado</h2>
                            <div className="product-details">
                                <p><strong>SKU:</strong> {scanResult.sku}</p>
                                <p><strong>Código de lote:</strong> {scanResult.batchCode}</p>
                                <p><strong>Nombre del producto:</strong> {scanResult.productName}</p>
                                <p><strong>Fecha de fabricación:</strong> {scanResult.manufacturingDate}</p>
                                <p><strong>Fecha de vencimiento:</strong> {scanResult.expirationDate}</p>
                                <p><strong>Fecha de escaneo:</strong> {new Date(scanResult.timestamp).toLocaleString()}</p>
                            </div>

                            <div className="button-group">
                                <button
                                    onClick={resetScanner}
                                    className="primary-button"
                                >
                                    📷 Escanear otro
                                </button>

                                <button
                                    onClick={exportToCSV}
                                    className="secondary-button"
                                >
                                    ⬇️ Exportar historial
                                </button>
                            </div>
                        </div>
                    )}

                    {scanHistory.length > 0 && !scanResult && (
                        <div className="history-card">
                            <h2>Historial de escaneos</h2>
                            <div className="history-list">
                                {scanHistory.slice(0, 5).map((scan, index) => (
                                    <div key={index} className="history-item">
                                        <p className="product-name">{scan.productName}</p>
                                        <p className="scan-timestamp">
                                            Escaneado: {new Date(scan.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <footer className="scanner-footer">
                <p>&copy; 2024 JPDevs</p>
            </footer>
        </div>
    );
};

export default QRScanner;