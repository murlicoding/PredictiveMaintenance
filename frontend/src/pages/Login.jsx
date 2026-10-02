import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    navigate("/verify-otp", {
      state: { email: email }
    });
  };

  return (
    <div className="login-page">

      <div className="login-left">
        <div className="brand">
          <div className="brand-icon">⚙</div>
          <div>
            <h1>Predictive</h1>
            <h1>Maintenance</h1>
          </div>
        </div>

        <div className="login-info">
          <h2>Predict failures before they happen.</h2>

          <p>
            Monitor machine health, analyze sensor data and schedule
            maintenance using predictive analytics.
          </p>

          <div className="feature">
            <span>✓</span>
            Real-time machine monitoring
          </div>

          <div className="feature">
            <span>✓</span>
            AI-powered failure prediction
          </div>

          <div className="feature">
            <span>✓</span>
            Intelligent maintenance scheduling
          </div>
        </div>
      </div>

      <div className="login-right">

        <div className="login-card">

          <div className="mobile-logo">⚙</div>

          <h2>Welcome back</h2>

          <p className="subtitle">
            Login to your maintenance control center
          </p>

          <form onSubmit={handleLogin}>

            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button type="submit">
              Send OTP
            </button>

          </form>

          <p className="security">
            🔒 Secure OTP authentication
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;