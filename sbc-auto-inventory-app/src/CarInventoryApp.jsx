import React, { useState, useRef } from "react";
import QrScanner from "qr-scanner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function CarInventoryApp() {
  const [cars, setCars] = useState([]);
  const [vin, setVin] = useState("");
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState(null);
  const videoRef = useRef(null);
  const scanner = useRef(null);

  const startScanner = () => {
    if (scanner.current) scanner.current.stop();
    scanner.current = new QrScanner(
      videoRef.current,
      (result) => {
        setVin(result.data);
        scanner.current.stop();
      },
      { highlightScanRegion: true }
    );
    scanner.current.start();
  };

  const handleAddCar = () => {
    const newCar = { vin, notes, photo, status: "Ready" };
    setCars([...cars, newCar]);
    setVin("");
    setNotes("");
    setPhoto(null);
  };

  const exportPDF = (status) => {
    const doc = new jsPDF();
    doc.text(`Car List - ${status}`, 14, 16);
    const rows = cars
      .filter((car) => car.status === status)
      .map((car, idx) => [idx + 1, car.vin, car.notes]);
    autoTable(doc, {
      head: [["#", "VIN", "Notes"]],
      body: rows,
    });
    doc.save(`car-list-${status}.pdf`);
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <img src="/logo.png" alt="SBC Auto Logo" style={{ maxWidth: 150 }} />
        <h1>SBC Auto Sales</h1>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>VIN:</label>
        <input value={vin} onChange={(e) => setVin(e.target.value)} />
        <button onClick={startScanner}>Scan VIN</button>
        <video ref={videoRef} style={{ width: "100%", maxWidth: 400 }}></video>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>Notes:</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>Upload Photo:</label>
        <input type="file" onChange={(e) => setPhoto(URL.createObjectURL(e.target.files[0]))} />
        {photo && <img src={photo} alt="Preview" style={{ maxWidth: 200, marginTop: 10 }} />}
      </div>

      <button onClick={handleAddCar}>Add Car</button>

      <div style={{ marginTop: 30 }}>
        <h2>Inventory</h2>
        {cars.map((car, i) => (
          <div key={i} style={{ marginBottom: 10, borderBottom: "1px solid #ccc" }}>
            <p><strong>VIN:</strong> {car.vin}</p>
            <p><strong>Notes:</strong> {car.notes}</p>
            {car.photo && <img src={car.photo} alt="Car" style={{ width: 100 }} />}
            <p><strong>Status:</strong> {car.status}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => exportPDF("Ready")}>Export Ready PDF</button>
        <button onClick={() => exportPDF("Mechanic")}>Export Mechanic PDF</button>
      </div>
    </div>
  );
}

export default CarInventoryApp;