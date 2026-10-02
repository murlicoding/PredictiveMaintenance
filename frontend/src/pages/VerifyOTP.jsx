import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  const handleVerify = (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      alert("Enter a 6-digit OTP");
      return;
    }

    navigate("/dashboard");
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
          <h2>Secure access to your control center.</h2>

          <p>
            Verify your identity to access machine monitoring,
            predictive analytics and maintenance scheduling.
          </p>
        </div>
      </div>

      <div className="login-right">

        <div className="login-card">

          <div className="mobile-logo">⚙</div>

          <h2>Verify OTP</h2>

          <p className="subtitle">
            Enter the 6-digit OTP sent to
            <br />
            <strong>{email}</strong>
          </p>

          <form onSubmit={handleVerify}>

            <label>OTP</label>

            <input
              type="text"
              maxLength="6"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, ""))
              }
            />

            <button type="submit">
              Verify & Continue
            </button>

          </form>

          <p className="security">
            Didn't receive the OTP? Resend OTP
          </p>

        </div>

      </div>

    </div>
  );
}

export default VerifyOTP;