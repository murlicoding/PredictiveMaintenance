import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home">

      <div className="home-content">

        <p className="tag">
          SMART MANUFACTURING
        </p>

        <h1>
          Predict Machine Failures
          <br />
          Before They Happen
        </h1>

        <p className="description">
          Upload machine data and use machine learning to
          identify failure risks and plan maintenance in advance.
        </p>

        <Link to="/upload" className="upload-btn">
          Upload Dataset
        </Link>

      </div>

      <div className="machine-card">

        <div className="card-top">
          <span>Machine Health</span>
          <span className="monitoring">● Monitoring</span>
        </div>

        <div className="machine-icon">
          ⚙️
        </div>

        <h2>Predictive Analysis</h2>

        <p>
          AI-powered monitoring of machine operating conditions.
        </p>

        <div className="metrics">

          <div>
            <strong>97.3%</strong>
            <span>Model Accuracy</span>
          </div>

          <div>
            <strong>10K</strong>
            <span>Machines</span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Home;