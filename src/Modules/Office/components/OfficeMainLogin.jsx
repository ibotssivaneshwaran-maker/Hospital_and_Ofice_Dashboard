  import React from 'react'
  import { Link, Outlet } from 'react-router-dom'

  const OfficeMainLogin = () => {
    return (
      <>
      <div className="Button-container">
          <Link className="admin-login-button" to={"officeAdminLogin"}>Admin</Link>
          <Link className="doctor-login-button" to={"InternLogin"}>Intern</Link>
        </div>
        <Outlet />
      </>
    )
  }

  export default OfficeMainLogin