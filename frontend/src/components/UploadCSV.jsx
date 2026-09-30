import { useState } from "react";

function UploadCSV() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile && selectedFile.name.endsWith(".csv")) {
      setFile(selectedFile);
    } else {
      alert("Please select a CSV file.");
      setFile(null);
    }
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a CSV file first.");
      return;
    }

    console.log("Selected file:", file.name);
  };

  return (
    <div className="upload-container">

      <h2>Upload Machine Dataset</h2>

      <p>
        Upload your CSV file to analyze machine health
        and predict possible failures.
      </p>

      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
      />

      {file && (
        <p className="file-name">
          Selected: {file.name}
        </p>
      )}

      <button onClick={handleUpload}>
        Upload Dataset
      </button>

    </div>
  );
}

export default UploadCSV;