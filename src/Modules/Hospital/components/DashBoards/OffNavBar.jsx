import React from "react";
import { NavLink, useParams } from "react-router-dom";

const OffNavBar = () => {
  const { action } = useParams();

  return (
    <nav className="navbar">
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
          <NavLink to="/" className="nav-link">
            Log Out
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default OffNavBar;
