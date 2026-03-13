import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function FileUpload() {
  const [portfolio, setPortfolio] = useState("");
  const [locFile, setLocFile] = useState(null);
  const [accFile, setAccFile] = useState(null);

  const [locPreview, setLocPreview] = useState([]);
  const [accPreview, setAccPreview] = useState([]);

  const [popup, setPopup] = useState({ message: "", type: "success" });

  const requiredStringCols = ["CNTRYSCHEME", "OCCTYPE"];

  // Parse CSV file
  const handleFile = (file, setPreview) => {
    window.Papa.parse(file, {
      header: true,
      complete: (results) => {
        setPreview(results.data.slice(0, 5)); // show first 5 rows
      },
    });
  };

  // Validate Loc CSV
  const validateLocData = (rows) => {
    let errors = [];
    rows.forEach((row, i) => {
      if (row.CNTRYSCHEME !== "ISO2A") {
        errors.push(`Row ${i} CNTRYSCHEME must be ISO2A`);
      }
      if (Number(row.OCCTYPE) >= 100) {
        errors.push(`Row ${i} OCCTYPE must be < 100`);
      }
      if (isNaN(row.LATITUDE)) {
        errors.push(`Row ${i} LATITUDE must be a number`);
      }
      requiredStringCols.forEach((col) => {
        if (!row[col] || row[col].toString().trim() === "") {
          errors.push(`Row ${i} ${col} is required and cannot be empty`);
        }
      });
    });
    return errors;
  };

  // Handle cell edits
  const handleCellChange = (table, rowIndex, key, value) => {
    if (table === "loc") {
      const updated = [...locPreview];
      updated[rowIndex][key] = value;
      setLocPreview(updated);
    } else if (table === "acc") {
      const updated = [...accPreview];
      updated[rowIndex][key] = value;
      setAccPreview(updated);
    }
  };

  // Submit data
  const handleSubmit = async () => {
    console.log("Submit clicked");

    const errors = validateLocData(locPreview);

    if (errors.length > 0) {
      setPopup({ message: errors.join("\n"), type: "error" });
      setTimeout(() => setPopup({ message: "", type: "success" }), 5000);
      return;
    }

    if (!portfolio) {
      setPopup({ message: "Please enter a Portfolio Name", type: "error" });
      setTimeout(() => setPopup({ message: "", type: "success" }), 5000);
      return;
    }

    // Remove empty rows
    const cleanedLoc = locPreview.filter(row => Object.values(row).some(v => v !== ""));
    const cleanedAcc = accPreview.filter(row => Object.values(row).some(v => v !== ""));

    try {
      const res = await axios.post("http://localhost:8000/upload_json", {
        portfolio_name: portfolio,
        loc_data: cleanedLoc,
        acc_data: cleanedAcc
      });

      if (res.data.status === "error") {
        setPopup({
          message: `Upload failed: ${res.data.errors ? res.data.errors.join(", ") : res.data.message}`,
          type: "error"
        });
      } else {
        setPopup({
          message: `Upload successful! Portfolio: ${res.data.portfolio}`,
          type: "success"
        });
      }

      setTimeout(() => setPopup({ message: "", type: "success" }), 5000);
    } catch (err) {
      console.error("Upload error:", err);
      setPopup({
        message: "Upload failed. Please try again.",
        type: "error"
      });
      setTimeout(() => setPopup({ message: "", type: "success" }), 5000);
    }
  };

  // Editable table component – **must be defined here, not inside handleSubmit**
  const EditableTable = ({ data, tableType }) => {
    if (!data || data.length === 0) return <p>No preview available</p>;

    return (
      <table border="1">
        <thead>
          <tr>
            {Object.keys(data[0]).map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.entries(row).map(([key, value], colIndex) => (
                <td key={colIndex}>
                  <input
                    type="text"
                    defaultValue={value || ""}
                    onBlur={(e) => handleCellChange(tableType, rowIndex, key, e.target.value)}
                    style={{ width: "100%", border: "none", background: "transparent" }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Return JSX
  return (
    <div className="page-container">
      {popup.message && (
        <div className={`popup-message ${popup.type}`}>
          {popup.message}
        </div>
      )}

      <header className="header">
        <h1>Howden CSV Uploader</h1>
      </header>

      <div className="container">
        <div className="input-group">
          <label>Portfolio Name:</label>
          <input type="text" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} />
        </div>

        <div className="input-group">
          <label>Upload Test_Loc.csv:</label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => {
              setLocFile(e.target.files[0]);
              handleFile(e.target.files[0], setLocPreview);
            }}
          />
        </div>

        <div className="input-group">
          <label>Upload Test_Acc.csv:</label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => {
              setAccFile(e.target.files[0]);
              handleFile(e.target.files[0], setAccPreview);
            }}
          />
        </div>

        <h3>Loc File Preview (Editable)</h3>
        <div className="table-wrapper">
          <EditableTable data={locPreview} tableType="loc" />
        </div>

        <h3>Acc File Preview (Editable)</h3>
        <div className="table-wrapper">
          <EditableTable data={accPreview} tableType="acc" />
        </div>

        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}

export default FileUpload;