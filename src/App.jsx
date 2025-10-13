import React from 'react'
import '../src/App.css'
import Login from './Modules/Hospital/components/Login'
import AdminLogin from "./Modules/Hospital/components/AdminLogin";
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import DoctorLogin from './Modules/Hospital/components/DoctorLogin';
import ReceptionistLogin from './Modules/Hospital/components/ReceptionistLogin';
import MainPage from './Modules/Hospital/components/MainPage';
import OfficeAdminLogin from './Modules/Office/components/OfficeAdminLogin';
import InternLogin from './Modules/Office/components/InternLogin';
import OfficeMainLogin from './Modules/Office/components/OfficeMainLogin';
import DynamicDashboard from './Modules/Hospital/components/DynamicDashboard';
const App = () => {
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/'element={<MainPage />}></Route>

          <Route path='/hospitalLogin'element={<Login />}>
            <Route index element={<AdminLogin />}></Route>
            <Route path="admin"element={<AdminLogin />}></Route>
            <Route path="doctor"element={<DoctorLogin />}></Route>
            <Route path="receptionistandstaff"element={<ReceptionistLogin />}></Route>
          </Route>
          <Route path='/officeLogin'element={<OfficeMainLogin />}>
            <Route index element={<OfficeAdminLogin />} />
            <Route path='officeAdminLogin'element={<OfficeAdminLogin />}/>
            <Route path='InternLogin'element={<InternLogin />}/>
          </Route>
           <Route path='/:action/dashboard'element={<DynamicDashboard />}></Route>
        </Routes>
        </BrowserRouter>
  )
}

export default App