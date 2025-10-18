import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Modules/Hospital/components/Login";
import AdminLogin from "./Modules/Hospital/components/AdminLogin";
import DoctorLogin from "./Modules/Hospital/components/DoctorLogin";
import ReceptionistLogin from "./Modules/Hospital/components/ReceptionistLogin";
import MainPage from "./Modules/Hospital/components/MainPage";
import OfficeAdminLogin from "./Modules/Office/components/OfficeAdminLogin";
import InternLogin from "./Modules/Office/components/InternLogin";
import OfficeMainLogin from "./Modules/Office/components/OfficeMainLogin";
import DynamicDashboard from "./Modules/Hospital/components/DynamicDashboard";
import PrivateRoute from "./PrivateRoute";
import AdminHome from "./Modules/Hospital/components/AdminHome";
import AdminDashBoard from "./Modules/Hospital/components/DashBoards/AdminDashBoard";
import DoctorsSchedule from "./Modules/Hospital/components/DashBoards/DoctorsSchedule";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />

        <Route path="/hospitalLogin" element={<Login />}>
          <Route index element={<AdminLogin />} />
          <Route path="admin" element={<AdminLogin />} />
          <Route path="doctor" element={<DoctorLogin />} />
          <Route path="receptionistandstaff" element={<ReceptionistLogin />} />
        </Route>

        <Route path="/officeLogin" element={<OfficeMainLogin />}>
          <Route index element={<OfficeAdminLogin />} />
          <Route path="officeAdminLogin" element={<OfficeAdminLogin />} />
          <Route path="InternLogin" element={<InternLogin />} />
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
</Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;
