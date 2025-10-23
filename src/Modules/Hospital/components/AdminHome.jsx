import { useEffect, useState } from "react";

const AdminHome = () => {
   const APP_SCRIPT_URL =
        "https://script.google.com/macros/s/AKfycbz0OLVtXQmky-l57zhLc9aCk02t1vS5TB9pzORL-fVNvnVoBKeZe5MnaKry2FAmoQUy/exec";

  const [stats, setStats] = useState({
    doctorsLength: 0,
    appointmentsLength: 0,
    taskDataLength:0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const doctorsRes = await fetch(`${APP_SCRIPT_URL}?action=getDoctors`);
      const doctorsData = await doctorsRes.json();

      const appointmentsRes = await fetch(`${APP_SCRIPT_URL}?action=getAppointments`);
      const appointmentsData = await appointmentsRes.json();

      const taskRes = await fetch(`${APP_SCRIPT_URL}?action=getTasks`);
      const taskData = await taskRes.json();

      console.log(taskData.res.length)

      setStats({
        doctorsLength: doctorsData.status === "success" ? doctorsData.res.length : 0,
        appointmentsLength: appointmentsData.status === "success" ? appointmentsData.result.length : 0,
        taskDataLength:taskData.status === "success" ? taskData.res.length : 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };
  console.log(stats)

  return (
    <div className="doctorContainer">
      <h1 style={{ textAlign: "center", marginTop: "2rem" }}>
        Welcome {localStorage.getItem("role") === "Doctor" ? `${localStorage.getItem("role")}👨‍⚕️`:localStorage.getItem("role")} 
      </h1>
      {localStorage.getItem("role") === ("Staff" || "Doctor" || "Admin") ?<div>
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
