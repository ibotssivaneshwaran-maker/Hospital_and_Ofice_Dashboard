import React from 'react';
import { NavLink, useParams } from 'react-router-dom';

const NavigationBar = () => {
  const { action } = useParams();

  return (
    <nav className="navbar">
      <ul>
        <li><NavLink to={`/${action}/dashboard/home`} className="nav-link">Home</NavLink></li>
        <li><NavLink to={`/${action}/dashboard/appointments`} className="nav-link">Appointments</NavLink></li>
        <li><NavLink to={`/${action}/dashboard/doctors`} className="nav-link">Doctors</NavLink></li>
        <li><NavLink to="/" className="nav-link">Log Out</NavLink></li>
      </ul>
    </nav>
  );
};

export default NavigationBar;
