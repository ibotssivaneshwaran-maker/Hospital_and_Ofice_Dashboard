import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

const OfficeMainLogin = () => {
  const [activeRole, setActiveRole] = useState("officeadmin");
  localStorage.setItem("isAuthenticated", "false");
  localStorage.setItem("role", null);

  const handleClick = (role) => {
    setActiveRole(role);
  };
  return (
    <div className="login-page">
      <div className="Button-container">
        <Link
          className={`admin-login-button ${
            activeRole === "officeadmin" ? "active" : ""
          }`}
          onClick={() => handleClick("officeadmin")}
          to={"officeAdminLogin"}
        >
          Admin
        </Link>
        <Link
          className={`intern-login-button ${
            activeRole === "intern" ? "active" : ""
          }`}
          onClick={() => handleClick("intern")}
          to={"InternLogin"}
        >
          Intern
        </Link>
      </div>
      <Outlet />
    </div>
  );
};

export default OfficeMainLogin;
