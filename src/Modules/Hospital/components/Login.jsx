import React from "react";
import "../components/CSS/login.css"
import { Link, Outlet } from "react-router-dom";
import AdminLogin from "./AdminLogin";

const Login = () => {

  const cssStyles = {
    backgroundColor:"blue"
  }
  const cssStyles1 = {
    backgroundColor:"white"
  }
  const cssStyles2 = {
    backgroundColor:"white"
  }
  return (
    <>
      <div className="Button-container">
        <Link className="admin-login-button"style={cssStyles}onClick={() => cssStyles.backgroundColor = "blue"} to={"admin"}>Admin</Link>
        <Link className="doctor-login-button"style={cssStyles1}onClick={() => cssStyles1.backgroundColor = "blue"} to={"doctor"}>Doctor</Link>
        <Link className="rec-login-button"style={cssStyles2} to={"receptionistandstaff"}>Receptionist/Staff</Link>
      </div>
      <Outlet />
    </>
  );
};

export default Login;
