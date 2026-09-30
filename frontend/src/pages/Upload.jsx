import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Upload() {

    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);


    // ==========================================
    // FILE VALIDATION
    // ==========================================

    const selectFile = (selectedFile) => {

        if (!selectedFile) {
            return;
        }

        if (!selectedFile.name.toLowerCase().endsWith(".csv")) {

            alert("Please select a CSV file.");

            return;
        }

        setFile(selectedFile);
        setResult(null);
    };


    // ==========================================
    // FILE INPUT
    // ==========================================

    const handleFileChange = (event) => {

        const selectedFile =
            event.target.files[0];

        selectFile(selectedFile);
    };


    // ==========================================
    // DRAG EVENTS
    // ==========================================

    const handleDragOver = (event) => {

        event.preventDefault();

        setDragActive(true);
    };


    const handleDragLeave = () => {

        setDragActive(false);
    };


    const handleDrop = (event) => {

        event.preventDefault();

        setDragActive(false);

        const droppedFile =
            event.dataTransfer.files[0];

        selectFile(droppedFile);
    };


    // ==========================================
    // UPLOAD
    // ==========================================

    const handleUpload = async () => {

        if (!file) {

            alert(
                "Please select a CSV file first."
            );

            return;
        }


        const formData = new FormData();

        formData.append(
            "file",
            file
        );


        setLoading(true);
        setResult(null);


        try {

            const response = await fetch(
                "https://predictivemaintenance-i9rh.onrender.com/upload",
                {
                    method: "POST",
                    body: formData
                }
            );


            const data =
                await response.json();


            console.log(
                "Upload response:",
                data
            );


            if (!response.ok) {

                alert(
                    data.error ||
                    "Dataset analysis failed."
                );

                return;
            }


            setResult(data);


            // Save result for other pages

            localStorage.setItem(
                "predictionResult",
                JSON.stringify(data)
            );


        } catch (error) {

            console.error(
                "Upload error:",
                error
            );


            alert(
                "Unable to connect with Flask server."
            );


        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // FILE SIZE
    // ==========================================

    const fileSize = file
        ? (file.size / 1024).toFixed(1)
        : null;


    return (

        <div className="upload-page">


            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <div className="page-header">

                <p className="dashboard-tag">
                    DATA MANAGEMENT
                </p>

                <h1>
                    Upload Machine Dataset
                </h1>

                <p>
                    Upload your machine sensor CSV
                    to analyze equipment health and
                    predict possible failures.
                </p>

            </div>


            {/* ================================= */}
            {/* UPLOAD CARD */}
            {/* ================================= */}

            <div className="upload-card">


                <div
                    className={
                        dragActive
                            ? "upload-dropzone drag-active"
                            : "upload-dropzone"
                    }

                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >

                    <div className="upload-icon">
                        ↑
                    </div>


                    <h2>
                        {file
                            ? file.name
                            : "Upload your CSV dataset"}
                    </h2>


                    <p>

                        {file
                            ? `${fileSize} KB • CSV file selected`
                            : "Drag and drop your file here, or click below to browse"}

                    </p>


                    <label className="browse-button">

                        Browse CSV File

                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            hidden
                        />

                    </label>


                    <small>
                        Supported format: CSV
                    </small>

                </div>


                {/* ================================= */}
                {/* SELECTED FILE */}
                {/* ================================= */}

                {file && (

                    <div className="selected-file">

                        <div>

                            <strong>
                                Selected Dataset
                            </strong>

                            <p>
                                {file.name}
                            </p>

                        </div>


                        <button
                            onClick={() => {
                                setFile(null);
                                setResult(null);
                            }}
                        >
                            Remove
                        </button>

                    </div>

                )}


                {/* ================================= */}
                {/* ANALYZE BUTTON */}
                {/* ================================= */}

                <button
                    className="analyze-btn"
                    onClick={handleUpload}
                    disabled={
                        loading ||
                        !file
                    }
                >

                    {loading
                        ? "Analyzing Dataset..."
                        : "Upload & Analyze Dataset"}

                </button>


                {/* ================================= */}
                {/* RESULTS */}
                {/* ================================= */}

                {result && (

                    <div className="upload-results">


                        <div className="success-message">

                            ✓ Dataset analyzed successfully

                        </div>


                        <div className="result-grid">


                            <div className="result-box">

                                <span>
                                    Rows
                                </span>

                                <strong>
                                    {result.rows ||
                                        result.total_machines ||
                                        0}
                                </strong>

                            </div>


                            <div className="result-box">

                                <span>
                                    Columns
                                </span>

                                <strong>
                                    {result.columns ||
                                        0}
                                </strong>

                            </div>


                            <div className="result-box">

                                <span>
                                    Safe Machines
                                </span>

                                <strong>
                                    {result.safe_machines ||
                                        0}
                                </strong>

                            </div>


                            <div className="result-box danger">

                                <span>
                                    Predicted Failures
                                </span>

                                <strong>
                                    {result.predicted_failures ||
                                        0}
                                </strong>

                            </div>


                        </div>


                        <div className="result-actions">

                            <button
                                className="secondary-btn"
                                onClick={() =>
                                    navigate(
                                        "/dashboard"
                                    )
                                }
                            >
                                View Dashboard
                            </button>


                            <button
                                className="primary-btn"
                                onClick={() =>
                                    navigate(
                                        "/predict"
                                    )
                                }
                            >
                                Predict Machine Risk
                            </button>

                        </div>


                    </div>

                )}

            </div>

        </div>

    );

}

export default Upload;