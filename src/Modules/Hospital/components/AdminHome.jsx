import { useEffect, useRef, useState } from "react";

const AdminHome = () => {
   const APP_SCRIPT_URL =
        "https://script.google.com/macros/s/AKfycbz0OLVtXQmky-l57zhLc9aCk02t1vS5TB9pzORL-fVNvnVoBKeZe5MnaKry2FAmoQUy/exec";

        const hasFetched = useRef(false)
  const [stats, setStats] = useState({
    doctorsLength: 0,
    appointmentsLength: 0,
    taskDataLength:0
  });

  useEffect(() => {
    if(!hasFetched.current){
      fetchStats();
      hasFetched.current = true
    }
  }, []);

  const fetchStats = async () => {
    try {
      const doctorsRes = await fetch(`${APP_SCRIPT_URL}?action=getDoctors`);
      const doctorsResponseData = await doctorsRes.json();

      const doctorsData = localStorage.getItem("role") === "Doctor" ? doctorsResponseData.res.filter((el) => el.doctorName === localStorage.getItem("name")) :doctorsResponseData.res

      const appointmentsRes = await fetch(`${APP_SCRIPT_URL}?action=getAppointments`);
      const appointmentsResponseData = await appointmentsRes.json();

      const appointmentsData =localStorage.getItem("role") === "Doctor" ? appointmentsResponseData.result.filter((el) => el.doctorName === localStorage.getItem("name")) : appointmentsResponseData.result

      const taskRes = await fetch(`${APP_SCRIPT_URL}?action=getTasks`);
      const taskResponseData = await taskRes.json();

      const taskData = localStorage.getItem("role") === "intern" ? taskResponseData.res.filter((student) => student.assignedTo === localStorage.getItem("name")) : taskResponseData.res
      setStats({
        doctorsLength: doctorsResponseData.status === "success" ? doctorsData.length : 0,
        appointmentsLength: appointmentsResponseData.status === "success" ? appointmentsData.length : 0,
        taskDataLength:taskResponseData.status === "success" ? taskData.length : 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  return (
    <div className="doctorContainer">
      <h1 style={{ textAlign: "center", marginTop: "2rem" }}>
        Welcome {localStorage.getItem("role") === "Doctor" ? `${localStorage.getItem("role")} ${localStorage.getItem("name")}👨‍⚕️`:localStorage.getItem("name") ? localStorage.getItem("name"):localStorage.getItem("role")} 
      </h1>
      {(localStorage.getItem("role") === "Staff") || (localStorage.getItem("role")=== "Doctor") || (localStorage.getItem("role") ===  "Admin") ?<div>
       <p style={{ textAlign: "center" }}>
        Manage doctors, appointments, and hospital records efficiently.
      </p>
      <div className="lengthContainer">
        <h2>Available Doctors: {stats.doctorsLength}</h2>
        <h2>Total Appointments: {stats.appointmentsLength}</h2>
      </div></div>:<div className="lengthContainer">
        <h2>Total Tasks: {stats.taskDataLength}</h2>
      </div>}
    </div>
  );
};

export default AdminHome;
