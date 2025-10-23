import React from "react";
import { Outlet, useParams } from "react-router-dom";
import NavigationBar from "./DashBoards/NavigationBar";
import OffNavBar from "./DashBoards/OffNavBar";

const DynamicDashboard = () => {
  const { action } = useParams();
  const role = action.toLowerCase();

  return (
    <div>
      {role === "offadmin" || role === "intern" ? (
        <OffNavBar />
      ) : (
        <NavigationBar />
      )}
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};

export default DynamicDashboard;
