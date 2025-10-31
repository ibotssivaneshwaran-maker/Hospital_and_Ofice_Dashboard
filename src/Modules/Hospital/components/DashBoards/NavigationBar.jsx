import { NavLink, useParams } from "react-router-dom";
import "../CSS/adminDashBoard.css";

const NavigationBar = () => {
  const handleLogout = () => {
    localStorage.setItem("role", null);
    localStorage.setItem("isAuthenticated", false);
    localStorage.setItem("name", null);
    localStorage.setItem("detail",null)
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <h1 className="sugam-heading">Sugam Medical</h1>
      <ul>
        <li>
          <NavLink to={`/${localStorage.getItem("role")}/dashboard/home`} className="nav-link">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to={`/${localStorage.getItem("role")}/dashboard/appointments`} className="nav-link">
            Appointments
          </NavLink>
        </li>
        <li>
          <NavLink to={`/${localStorage.getItem("role")}/dashboard/doctors`} className="nav-link">
            Doctors
          </NavLink>
        </li>
        <li>
          <NavLink to={`/${localStorage.getItem("role")}/dashboard/reports`} className="nav-link">
            Reports
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/"
            onClick={handleLogout}
            className="nav-link"
          >
            Log Out
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavigationBar;
