import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import NavigationBar from './DashBoards/NavigationBar';

const DynamicDashboard = () => {
  const { action } = useParams();

  // Only support admin for now
  if (action.toLowerCase() !== 'admin') {
    return <h2>Role not supported yet</h2>;
  }

  return (
    <div>
      <NavigationBar />
      <div className="dashboard-content">
        <Outlet />  {/* Nested routes like /home or /appointments will render here */}
      </div>
    </div>
  );
};

export default DynamicDashboard;
