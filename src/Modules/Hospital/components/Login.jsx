import React from "react";
import "../components/CSS/login.css"
import { Link, Outlet } from "react-router-dom";
import AdminLogin from "./AdminLogin";

const Login = () => {
  return (
    <>
      <div className="Button-container">
        <Link className="admin-login-button" to={"admin"}>Admin</Link>
        <Link className="doctor-login-button" to={"doctor"}>Doctor</Link>
        <Link className="rec-login-button" to={"receptionistandstaff"}>Receptionist/Staff</Link>
      </div>
      <Outlet />
    </>
  );
};

export default Login;
