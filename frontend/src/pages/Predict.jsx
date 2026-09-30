import { useState } from "react";

function Predict() {

    const [formData, setFormData] = useState({
        Type: "M",
        "Air temperature [K]": "",
        "Process temperature [K]": "",
        "Rotational speed [rpm]": "",
        "Torque [Nm]": "",
        "Tool wear [min]": ""
    });

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);


    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });

    };


    const handlePredict = async () => {

        if (
            !formData["Air temperature [K]"] ||
            !formData["Process temperature [K]"] ||
            !formData["Rotational speed [rpm]"] ||
            !formData["Torque [Nm]"] ||
            !formData["Tool wear [min]"]
        ) {

            alert(
                "Please enter all machine parameters."
            );

            return;
        }


        setLoading(true);
        setResult(null);


        try {

            const response = await fetch(
               "https://predictivemaintenance-i9rh.onrender.com/predict",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        Type: formData.Type,

                        "Air temperature [K]":
                            Number(
                                formData[
                                    "Air temperature [K]"
                                ]
                            ),

                        "Process temperature [K]":
                            Number(
                                formData[
                                    "Process temperature [K]"
                                ]
                            ),

                        "Rotational speed [rpm]":
                            Number(
                                formData[
                                    "Rotational speed [rpm]"
                                ]
                            ),

                        "Torque [Nm]":
                            Number(
                                formData[
                                    "Torque [Nm]"
                                ]
                            ),

                        "Tool wear [min]":
                            Number(
                                formData[
                                    "Tool wear [min]"
                                ]
                            )

                    })
                }
            );


            const data =
                await response.json();


            console.log(
                "Prediction response:",
                data
            );


            if (!response.ok) {

                alert(
                    data.error ||
                    "Prediction failed."
                );

                return;
            }


            setResult(data);


        } catch (error) {

            console.error(
                "Prediction error:",
                error
            );


            alert(
                "Unable to connect with Flask server."
            );


        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="predict-page">


            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <div className="page-header">

                <p className="dashboard-tag">
                    MACHINE INTELLIGENCE
                </p>

                <h1>
                    Machine Risk Prediction
                </h1>

                <p>
                    Enter machine operating parameters
                    to predict the probability of failure.
                </p>

            </div>


            <div className="prediction-layout">


                {/* ================================= */}
                {/* FORM */}
                {/* ================================= */}

                <div className="prediction-card">

                    <h2>
                        Machine Parameters
                    </h2>

                    <p className="card-description">
                        Enter the current operating
                        conditions of the machine.
                    </p>


                    {/* MACHINE TYPE */}

                    <div className="form-group">

                        <label>
                            Machine Type
                        </label>

                        <select
                            name="Type"
                            value={formData.Type}
                            onChange={handleChange}
                        >

                            <option value="L">
                                L
                            </option>

                            <option value="M">
                                M
                            </option>

                            <option value="H">
                                H
                            </option>

                        </select>

                    </div>


                    {/* AIR TEMPERATURE */}

                    <div className="form-group">

                        <label>
                            Air Temperature [K]
                        </label>

                        <input
                            type="number"
                            name="Air temperature [K]"
                            value={
                                formData[
                                    "Air temperature [K]"
                                ]
                            }
                            onChange={handleChange}
                            placeholder="Example: 300"
                        />

                    </div>


                    {/* PROCESS TEMPERATURE */}

                    <div className="form-group">

                        <label>
                            Process Temperature [K]
                        </label>

                        <input
                            type="number"
                            name="Process temperature [K]"
                            value={
                                formData[
                                    "Process temperature [K]"
                                ]
                            }
                            onChange={handleChange}
                            placeholder="Example: 310"
                        />

                    </div>


                    {/* ROTATIONAL SPEED */}

                    <div className="form-group">

                        <label>
                            Rotational Speed [rpm]
                        </label>

                        <input
                            type="number"
                            name="Rotational speed [rpm]"
                            value={
                                formData[
                                    "Rotational speed [rpm]"
                                ]
                            }
                            onChange={handleChange}
                            placeholder="Example: 1500"
                        />

                    </div>


                    {/* TORQUE */}

                    <div className="form-group">

                        <label>
                            Torque [Nm]
                        </label>

                        <input
                            type="number"
                            name="Torque [Nm]"
                            value={
                                formData[
                                    "Torque [Nm]"
                                ]
                            }
                            onChange={handleChange}
                            placeholder="Example: 40"
                        />

                    </div>


                    {/* TOOL WEAR */}

                    <div className="form-group">

                        <label>
                            Tool Wear [min]
                        </label>

                        <input
                            type="number"
                            name="Tool wear [min]"
                            value={
                                formData[
                                    "Tool wear [min]"
                                ]
                            }
                            onChange={handleChange}
                            placeholder="Example: 100"
                        />

                    </div>


                    {/* BUTTON */}

                    <button
                        className="predict-button"
                        onClick={handlePredict}
                        disabled={loading}
                    >

                        {loading
                            ? "Analyzing Machine..."
                            : "Predict Machine Risk"
                        }

                    </button>

                </div>


                {/* ================================= */}
                {/* RESULT */}
                {/* ================================= */}

                <div className="prediction-result-card">

                    {!result && (

                        <div className="prediction-empty">

                            <div className="prediction-icon">
                                ⚙
                            </div>

                            <h2>
                                Awaiting Prediction
                            </h2>

                            <p>
                                Enter the machine parameters
                                and click the prediction button
                                to analyze machine risk.
                            </p>

                        </div>

                    )}


                    {result && (

                        <div className="prediction-result">

                            <p className="result-label">
                                PREDICTION RESULT
                            </p>


                            <h2>
                                Machine Analysis
                            </h2>


                            <div
                                className={
                                    result.prediction === 1
                                        ? "risk-indicator danger"
                                        : "risk-indicator safe"
                                }
                            >

                                <span className="risk-icon">

                                    {result.prediction === 1
                                        ? "⚠"
                                        : "✓"}

                                </span>


                                <div>

                                    <strong>

                                        {result.prediction === 1
                                            ? "High Failure Risk"
                                            : "Low Failure Risk"}

                                    </strong>

                                    <p>

                                        {result.prediction === 1
                                            ? "The machine may require maintenance."
                                            : "The machine is currently operating within a safer range."}

                                    </p>

                                </div>

                            </div>


                            {result.failure_probability !==
                                undefined && (

                                <div className="probability-box">

                                    <span>
                                        Failure Probability
                                    </span>

                                    <strong>
                                        {Number(
                                            result.failure_probability
                                        ).toFixed(2)}
                                        %
                                    </strong>

                                </div>

                            )}


                            <div className="prediction-details">

                                <div>
                                    <span>
                                        Machine Type
                                    </span>

                                    <strong>
                                        {formData.Type}
                                    </strong>
                                </div>


                                <div>
                                    <span>
                                        Torque
                                    </span>

                                    <strong>
                                        {formData["Torque [Nm]"]}
                                        {" Nm"}
                                    </strong>
                                </div>


                                <div>
                                    <span>
                                        Rotational Speed
                                    </span>

                                    <strong>
                                        {
                                            formData[
                                                "Rotational speed [rpm]"
                                            ]
                                        }
                                        {" rpm"}
                                    </strong>
                                </div>


                                <div>
                                    <span>
                                        Tool Wear
                                    </span>

                                    <strong>
                                        {
                                            formData[
                                                "Tool wear [min]"
                                            ]
                                        }
                                        {" min"}
                                    </strong>
                                </div>

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}

export default Predict;