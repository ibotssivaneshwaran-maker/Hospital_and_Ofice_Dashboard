import React, { useState } from "react";
import "../components/CSS/login.css";
import { Link, Outlet } from "react-router-dom";

const Login = () => {
  const [activeRole, setActiveRole] = useState("admin"); // default active = Admin

  const handleClick = (role) => {
    setActiveRole(role);
  };

  return (
    <>
      <div className="Button-container">
        <Link
          to="admin"
          onClick={() => handleClick("admin")}
          className={`admin-login-button ${
            activeRole === "admin" ? "active" : ""
          }`}
        >
          Admin
        </Link>

        <Link
          to="doctor"
          onClick={() => handleClick("doctor")}
          className={`doctor-login-button ${
            activeRole === "doctor" ? "active" : ""
          }`}
        >
          Doctor
        </Link>

        <Link
          to="receptionistandstaff"
          onClick={() => handleClick("receptionist")}
          className={`rec-login-button ${
            activeRole === "receptionist" ? "active" : ""
          }`}
        >
          Receptionist/Staff
        </Link>
      </div>

      <Outlet />
    </>
  );
};

export default Login;
