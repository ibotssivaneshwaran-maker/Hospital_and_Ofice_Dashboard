import React, { useCallback, useEffect, useState } from "react";
import "../CSS/login.css"
const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const APP_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyxnrwdz-AEoDY6IYeyiOWnlw0Zb7dcapMvDAHmf3OeCw9loYELF_BsPdYPP2T8pCO7/exec";
    const [status, setStatus] = useState("pending")
  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${APP_SCRIPT_URL}?action=getAppointments`);
      const result = await res.json();
      if (result.status === "success") {
        setAppointments(result.result);
        
      }
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
    console.log(appointments)
  }, []);

  const handleApprove = useCallback(
    async (appointmentId) => {
      try {
        const sendData = new URLSearchParams();
        sendData.append("action", "approve");
        sendData.append("id", appointmentId);

        const res = await fetch(APP_SCRIPT_URL, {
          method: "POST",
          body: sendData,
        });

        const result = await res.json();

        if (result.status === "success") {
          fetchAppointments();
          setStatus((prev) => 
            prev.map((el) =>
              el.id === appointmentId ? {...el,status:"Approved"} : el
            )
          )
        } else {
          alert("Failed to approve appointment");
        }
      } catch (error) {
        console.error("Error approving appointment:", error);
      }
    },
    [APP_SCRIPT_URL]
  );

  const handleReject = useCallback(
    async (appointmentId) => {
      try {
        const sendData = new URLSearchParams();
        sendData.append("action", "reject");
        sendData.append("id", appointmentId);

        const res = await fetch(APP_SCRIPT_URL, {
          method: "POST",
          body: sendData,
        });

        const result = await res.json();

        if (result.status === "success") {
          fetchAppointments();
          setStatus((prev) => 
            prev.map((el) =>
              el.id === appointmentId ? {...el,status:"Rejeccted"} : el
            )
          )
        } else {
          alert("Failed to approve appointment");
        }
      } catch (error) {
        console.error("Error approving appointment:", error);
      }
    },
    [APP_SCRIPT_URL]
  );

  return (
    <div>
      <h2>Doctor Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Patient Name</th>
            <th>Age</th>
            <th>Contact</th>
            <th>Doctor Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment, index) => (
            <tr key={appointment.id || index}>
              <td>{appointment.id}</td>
              <td>{appointment.patientName}</td>
              <td>{appointment.age}</td>
              <td>{appointment.contact}</td>
              <td>{appointment.doctorName}</td>
              <td>{appointment.date}</td>
              <td>{appointment.time}</td>
              <td>{appointment.status}</td>
              <td><button>Add Notes</button></td>
              <td>
                {appointment.status !== "pending" ? <button onClick={() => handleApprove(appointment.id)}>
                 {appointment.status}
                </button>: <div><button onClick={() => handleApprove(appointment.id)}>
                Approve
                </button>
                <button onClick={() => handleReject(appointment.id)}>
                  Reject
                </button></div>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  );
};

export default DoctorDashboard;
