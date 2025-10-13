import React from 'react'
import { useParams } from 'react-router-dom'
import AdminDashBoard from './DashBoards/AdminDashBoard';
import DoctorDashboard from './DashBoards/DoctorDashboard';
import ReceptionistDashboard from './DashBoards/ReceptionistDashboard';
import OfficeAdminDashBoard from '../../Office/components/OfficeDashBoard/OfficeAdminDashBoard';
import InternDashboard from '../../Office/components/OfficeDashBoard/InternDashboard';

const DynamicDashboard = () => {
  const {action} = useParams()

  switch (action.toLowerCase()){
     case "admin":
      return <AdminDashBoard />;
    case "doctor":
      return <DoctorDashboard />;
    case "intern":
      return <InternDashboard/>;
    case "staff":
      return <ReceptionistDashboard />;
    case "offadmin":
      return <OfficeAdminDashBoard />;
    case "intern":
      return <InternDashboard />;
    default:
      return <h2>Invalid role</h2>;
  }
  return (
    <>
    
    </>
  )
}

export default DynamicDashboard