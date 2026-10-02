import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation
} from "react-router-dom";

import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";
import Predict from "./pages/Predict";
import Login from "./pages/Login";
import VerifyOTP from "./pages/VerifyOTP";


function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">

      <div className="sidebar-logo">

        <div className="logo-icon">
          ⚙
        </div>

        <div>
          <h2>Predictive</h2>
          <span>Maintenance</span>
        </div>

      </div>


      <nav className="sidebar-nav">

        <p className="nav-title">
          MAIN MENU
        </p>


        <Link
          to="/"
          className={
            location.pathname === "/"
              ? "nav-link active"
              : "nav-link"
          }
        >
          <span>⌂</span>
          Home
        </Link>


        <Link
          to="/upload"
          className={
            location.pathname === "/upload"
              ? "nav-link active"
              : "nav-link"
          }
        >
          <span>↑</span>
          Upload Dataset
        </Link>


        <Link
          to="/predict"
          className={
            location.pathname === "/predict"
              ? "nav-link active"
              : "nav-link"
          }
        >
          <span>⚠</span>
          Manual Upload
        </Link>


        <Link
          to="/dashboard"
          className={
            location.pathname === "/dashboard"
              ? "nav-link active"
              : "nav-link"
          }
        >
          <span>◉</span>
          Dashboard
        </Link>

      </nav>


      <div className="sidebar-bottom">

        <div className="system-status">

          <span className="status-dot"></span>

          <div>
            <strong>System Online</strong>
            <small>ML API connected</small>
          </div>

        </div>

      </div>

    </aside>
  );
}


function AppLayout() {

  return (
    <div className="app-layout">

      <Sidebar />

      <main className="main-content">

        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/upload"
            element={<Upload />}
          />

          <Route
            path="/predict"
            element={<Predict />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

        </Routes>

      </main>

    </div>
  );
}


function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* Authentication */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/verify-otp"
          element={<VerifyOTP />}
        />


        {/* Main application */}

        <Route
          path="/*"
          element={<AppLayout />}
        />

      </Routes>

    </BrowserRouter>
  );
}


export default App;