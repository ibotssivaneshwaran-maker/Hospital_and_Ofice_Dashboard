import React from "react";
import NavigationBar from "../components/DashBoards/NavigationBar";
import { Outlet } from "react-router-dom";

const AdminHome = () => {
  return (
    <div>
      <h1 style={{ textAlign: "center", marginTop: "2rem" }}>Welcome Admin 👨‍⚕️</h1>
      <p style={{ textAlign: "center" }}>
        Manage doctors, appointments, and hospital records efficiently.
      </p>
      <Outlet />
    </div>
  );
};

export default AdminHome;
