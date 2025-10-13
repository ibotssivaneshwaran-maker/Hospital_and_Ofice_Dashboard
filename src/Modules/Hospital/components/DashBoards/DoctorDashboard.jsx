import React, { useCallback, useEffect, useState } from "react";
import "../CSS/login.css";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [popUp, setPopUp] = useState(false);
  const [notes, setNotes] = useState("");
  const [userId, setUserId] = useState(0);
  const [status, setStatus] = useState("pending");

  const APP_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbz0OLVtXQmky-l57zhLc9aCk02t1vS5TB9pzORL-fVNvnVoBKeZe5MnaKry2FAmoQUy/exec";

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
          setStatus("Approved");
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
          setStatus("Rejected");
        } else {
          alert("Failed to reject appointment");
        }
      } catch (error) {
        console.error("Error rejecting appointment:", error);
      }
    },
    [APP_SCRIPT_URL]
  );

  const handlePopUp = (id) => {
    setPopUp(true);
    setUserId(id);
  };

  const handleNotes = async () => {
    try {
      const sendData = new URLSearchParams();
      sendData.append("action", "notes");
      sendData.append("notes", `${notes}`);
      sendData.append("id", `${userId}`);

      const response = await fetch(APP_SCRIPT_URL, {
        method: "POST",
        body: sendData,
      });

      const res = await response.json();
      if (res.status === "success") {
        fetchAppointments();
        setNotes("");
        setPopUp(false);
      }
    } catch (error) {
      console.error("Error adding notes:", error);
    }
  };

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
              <td>
                {!appointment.notes ? (
                  <button onClick={() => handlePopUp(appointment.id)}>
                    Add Notes
                  </button>
                ) : (
                  <p>{appointment.notes}</p>
                )}
              </td>
              <td>
                {appointment.status !== "pending" ? (
                  <button>{appointment.status}</button>
                ) : (
                  <div>
                    <button onClick={() => handleApprove(appointment.id)}>
                      Approve
                    </button>
                    <button onClick={() => handleReject(appointment.id)}>
                      Reject
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {popUp && (
        <div className="popup-overlay">
          <div className="popup-container">
            <button className="close-btn" onClick={() => setPopUp(false)}>
              X
            </button>
            <h3>Add Notes</h3>
            <textarea
              placeholder="Enter Notes For your patient"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
            <button onClick={handleNotes}>Add</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
