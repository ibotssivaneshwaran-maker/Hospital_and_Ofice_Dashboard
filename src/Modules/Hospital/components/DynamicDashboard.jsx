import React from 'react'
import { useParams } from 'react-router-dom'
import AdminDashBoard from './DashBoards/AdminDashBoard';
import DoctorDashboard from './DashBoards/DoctorDashboard';
import ReceptionistDashboard from './DashBoards/ReceptionistDashboard';

const DynamicDashboard = () => {
  const {action} = useParams()

  switch (action.toLowerCase()){
     case "admin":
      return <AdminDashBoard />;
    case "doctor":
      return <DoctorDashboard />;
    case "intern":
      return <InternDashBoard/>;
    case "staff":
      return <ReceptionistDashboard />;
    default:
      return <h2>Invalid role</h2>;
  }
  return (
    <>
    
    </>
  )
}

export default DynamicDashboard