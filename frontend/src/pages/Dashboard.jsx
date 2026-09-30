import { useEffect, useState } from "react";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts";


function Dashboard() {

    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ==========================================
    // GET ANALYTICS
    // ==========================================

    useEffect(() => {

        fetch("http://127.0.0.1:5001/analytics")

            .then((response) => {

                if (!response.ok) {
                    throw new Error("Analytics request failed");
                }

                return response.json();

            })

            .then((data) => {

                console.log("FLASK ANALYTICS:", data);

                setAnalytics(data);

            })

            .catch((error) => {

                console.error("Analytics error:", error);

                setError(
                    "Unable to connect with Flask server."
                );

            })

            .finally(() => {

                setLoading(false);

            });

    }, []);


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="dashboard">
                <h1>Loading Dashboard...</h1>
            </div>
        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (
            <div className="dashboard">

                <h1>Dashboard Error</h1>

                <p>{error}</p>

            </div>
        );

    }


    if (!analytics) {

        return (
            <div className="dashboard">

                <h1>No Analytics Data</h1>

            </div>
        );

    }


    // ==========================================
    // GET DATA FROM FLASK
    // ==========================================

    const machinesByType =
        analytics.machines_by_type || {};

    const failureByType =
        analytics.failure_by_type || {};


    // ==========================================
    // CALCULATE TOTAL MACHINES
    // ==========================================

    const totalMachines =
        Object.values(machinesByType)
            .reduce(
                (total, value) =>
                    total + Number(value),
                0
            );


    // ==========================================
    // CALCULATE FAILURES
    // ==========================================

    const predictedFailures =
        Object.values(failureByType)
            .reduce(
                (total, value) =>
                    total + Number(value),
                0
            );


    // ==========================================
    // SAFE MACHINES
    // ==========================================

    const safeMachines =
        totalMachines - predictedFailures;


    // ==========================================
    // FAILURE RATE
    // ==========================================

    const failureRate =
        totalMachines > 0
            ? (
                predictedFailures /
                totalMachines
            ) * 100
            : 0;


    // ==========================================
    // PIE DATA
    // ==========================================

    const healthData = [

        {
            name: "Safe Machines",
            value: safeMachines
        },

        {
            name: "Predicted Failures",
            value: predictedFailures
        }

    ];


    // ==========================================
    // MACHINE TYPE DATA
    // ==========================================

    const typeData =
        Object.keys(machinesByType).map(
            (type) => {

                return {

                    type: type,

                    machines:
                        Number(
                            machinesByType[type]
                        ),

                    failures:
                        Number(
                            failureByType[type] || 0
                        )

                };

            }
        );


    console.log(
        "TYPE DATA:",
        typeData
    );

    console.log(
        "HEALTH DATA:",
        healthData
    );


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="dashboard">


            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <div className="dashboard-header">

                <div>

                    <p className="dashboard-tag">
                        MACHINE INTELLIGENCE
                    </p>

                    <h1>
                        Predictive Maintenance Dashboard
                    </h1>

                    <p>
                        Monitor machine health and
                        identify potential failures
                        using machine learning.
                    </p>

                </div>

            </div>


            {/* ================================= */}
            {/* STAT CARDS */}
            {/* ================================= */}

            <div className="dashboard-cards">


                <div className="dashboard-card">

                    <span>
                        Total Machines
                    </span>

                    <strong>
                        {totalMachines}
                    </strong>

                </div>


                <div className="dashboard-card">

                    <span>
                        Safe Machines
                    </span>

                    <strong>
                        {safeMachines}
                    </strong>

                </div>


                <div className="dashboard-card failure-card">

                    <span>
                        Predicted Failures
                    </span>

                    <strong>
                        {predictedFailures}
                    </strong>

                </div>


                <div className="dashboard-card">

                    <span>
                        Failure Rate
                    </span>

                    <strong>
                        {failureRate.toFixed(2)}%
                    </strong>

                </div>


            </div>


            {/* ================================= */}
            {/* CHARTS */}
            {/* ================================= */}

            <div className="dashboard-grid">


                {/* ================================= */}
                {/* PIE CHART */}
                {/* ================================= */}

                <div className="chart-card">

                    <h2>
                        Machine Health Overview
                    </h2>

                    <p>
                        Safe machines compared with
                        predicted failures.
                    </p>


                    <div
                        style={{
                            width: "100%",
                            height: "350px"
                        }}
                    >

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <PieChart>

                                <Pie
                                    data={healthData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={110}
                                    label
                                >

                                    <Cell
                                        fill="#22c55e"
                                    />

                                    <Cell
                                        fill="#ef4444"
                                    />

                                </Pie>

                                <Tooltip />

                                <Legend />

                            </PieChart>

                        </ResponsiveContainer>

                    </div>

                </div>


                {/* ================================= */}
                {/* MACHINE TYPE */}
                {/* ================================= */}

                <div className="chart-card">

                    <h2>
                        Failure by Machine Type
                    </h2>

                    <p>
                        Machine count and failures
                        by machine type.
                    </p>


                    <div
                        style={{
                            width: "100%",
                            height: "350px"
                        }}
                    >

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <BarChart
                                data={typeData}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    dataKey="type"
                                />

                                <YAxis />

                                <Tooltip />

                                <Legend />

                                <Bar
                                    dataKey="machines"
                                    name="Total Machines"
                                    fill="#3b82f6"
                                />

                                <Bar
                                    dataKey="failures"
                                    name="Failures"
                                    fill="#ef4444"
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </div>


            </div>
           {/* ================================= */}
{/* FEATURE IMPORTANCE */}
{/* ================================= */}

<div className="chart-card">

    <h2>
        Feature Importance
    </h2>

    <p>
        Factors contributing to machine failure
        prediction.
    </p>

    <div
        style={{
            width: "100%",
            height: "400px"
        }}
    >

        <ResponsiveContainer
            width="100%"
            height="100%"
        >

            <BarChart
                data={[
                    {
                        feature: "Torque",
                        importance: 0.3087
                    },
                    {
                        feature: "Rotational Speed",
                        importance: 0.3024
                    },
                    {
                        feature: "Tool Wear",
                        importance: 0.2081
                    },
                    {
                        feature: "Air Temperature",
                        importance: 0.0989
                    },
                    {
                        feature: "Process Temperature",
                        importance: 0.0649
                    },
                    {
                        feature: "Type L",
                        importance: 0.0085
                    },
                    {
                        feature: "Type M",
                        importance: 0.0055
                    },
                    {
                        feature: "Type H",
                        importance: 0.0031
                    }
                ]}
                layout="vertical"
                margin={{
                    top: 20,
                    right: 30,
                    left: 30,
                    bottom: 20
                }}
            >

                <CartesianGrid
                    strokeDasharray="3 3"
                />

                <XAxis
                    type="number"
                />

                <YAxis
                    type="category"
                    dataKey="feature"
                    width={150}
                />

                <Tooltip />

                <Bar
                    dataKey="importance"
                    name="Importance"
                    fill="#8b5cf6"
                    radius={[
                        0,
                        6,
                        6,
                        0
                    ]}
                />

            </BarChart>

        </ResponsiveContainer>

    </div>

</div>

            {/* ================================= */}
            {/* DATA SUMMARY */}
            {/* ================================= */}

            <div className="chart-card">

                <h2>
                    Machine Type Summary
                </h2>


                <div className="type-summary">

                    {typeData.map((item) => (

                        <div
                            className="type-box"
                            key={item.type}
                        >

                            <h3>
                                Type {item.type}
                            </h3>

                            <p>
                                Machines:
                                <strong>
                                    {" "}
                                    {item.machines}
                                </strong>
                            </p>

                            <p>
                                Failures:
                                <strong>
                                    {" "}
                                    {item.failures}
                                </strong>
                            </p>

                        </div>

                    ))}

                </div>

            </div>


        </div>

    );

}


export default Dashboard;