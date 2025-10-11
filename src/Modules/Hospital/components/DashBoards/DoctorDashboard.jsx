import React, { useCallback, useEffect, useState } from "react";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const APP_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyxnrwdz-AEoDY6IYeyiOWnlw0Zb7dcapMvDAHmf3OeCw9loYELF_BsPdYPP2T8pCO7/exec";

  

   useEffect(async () => {
    const res = await fetch(`${APP_SCRIPT_URL}?action=getAppointments`, {
      method: "GET",
    });
    const result = await res.json();
    if (result.status === "success") {
      setAppointments(result.result);
    }
  }, []);

  const handleApprove = useCallback((id) => {
  
  })

  const handleReject = () => {

  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>PatientName</th>
            <th>Patient Age</th>
            <th>Patient Mobile Number</th>
            <th>Doctor Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((elements, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{elements.patientName}</td>
              <td>{elements.age}</td>
              <td>{elements.contact}</td>
              <td>{elements.doctorName}</td>
              <td>{elements.date}</td>
              <td>{elements.time}</td>
              <td>{elements.status}</td>
              <td>
                <button onClick={handleApprove}>Approve</button>
                <button onClick={handleReject}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorDashboard;
