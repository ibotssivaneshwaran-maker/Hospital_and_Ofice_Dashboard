import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Modules/Hospital/components/Login";
import MainPage from "./Modules/Hospital/components/MainPage";
import OfficeMainLogin from "./Modules/Office/components/OfficeMainLogin";
import RoleLogin from "./Modules/Hospital/components/RoleLogin";
import PrivateRoute from "./PrivateRoute";

import DynamicDashboard from "./Modules/Hospital/components/DynamicDashboard";
import AdminHome from "./Modules/Hospital/components/AdminHome";
import AdminDashBoard from "./Modules/Hospital/components/DashBoards/AdminDashBoard";
import DoctorsSchedule from "./Modules/Hospital/components/DashBoards/DoctorsSchedule";
import OfficeAdminDashboard from "./Modules/Office/components/OfficeDashBoard/OfficeAdminDashBoard";
import OfficeRoleLogin from "./Modules/Office/components/OfficeRoleLogin";
import PatientReports from "./Modules/Hospital/components/DashBoards/PatientReports";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />

        <Route path="/hospitalLogin" element={<Login />}>
          <Route index element={<RoleLogin role="Admin" />} />
          <Route path="admin" element={<RoleLogin role="Admin" />} />
          <Route path="doctor" element={<RoleLogin role="Doctor" />} />
          <Route
            path="receptionistandstaff"
            element={<RoleLogin role="Staff" />}
          />
        </Route>

        <Route path="/officeLogin" element={<OfficeMainLogin />}>
  <Route index element={<OfficeRoleLogin role="officeadmin" />} />
  <Route path="officeAdminLogin" element={<OfficeRoleLogin role="officeadmin" />} />
  <Route path="InternLogin" element={<OfficeRoleLogin role="intern" />} />
</Route>


        <Route
          path="/:action/dashboard/*"
          element={
            <PrivateRoute>
              <DynamicDashboard />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="home" element={<AdminHome />} />
          <Route path="appointments" element={<AdminDashBoard />} />
          <Route path="doctors" element={<DoctorsSchedule />} />
          <Route path="reports" element={<PatientReports />} />

          <Route path="offhome" element={<AdminHome />} />
          <Route path="tasks" element={<OfficeAdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
