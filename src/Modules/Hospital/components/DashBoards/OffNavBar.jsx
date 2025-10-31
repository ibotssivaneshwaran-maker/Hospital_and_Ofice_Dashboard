import React from "react";
import { NavLink, useParams } from "react-router-dom";
import "../CSS/adminDashBoard.css";

const OffNavBar = () => {
  const { action } = useParams();

  const handleLogout = () => {
    localStorage.setItem("role", null);
    localStorage.setItem("isAuthenticated", false);
    window.location.href = "/"; 
  };

  return (
    <nav className="navbar">
      <h1 className="sugam-heading">iBots</h1>
      <ul>
        <li>
          <NavLink to={`/${action}/dashboard/offhome`} className="nav-link">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to={`/${action}/dashboard/tasks`} className="nav-link">
            Tasks
          </NavLink>
        </li>
        <li>
          <NavLink to="/" onClick={handleLogout} className="nav-link">
            Log Out
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default OffNavBar;
