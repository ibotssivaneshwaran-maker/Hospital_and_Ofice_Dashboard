import React, { useCallback, useEffect, useState } from "react";
import '../CSS/adminDashBoard.css';
import NavigationBar from "./NavigationBar.jsx";

const AdminDashBoard = () => {
  const [inputs, setInputs] = useState([]);
  const [isEditMode, setEditMode] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isStatus, setIsstatus] = useState(false);
  const [details, setDetails] = useState({
    patientName: "",
    age: "",
    contact: "",
    doctorName: "",
    date: "",
    time: "",
  });

  const APP_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbz0OLVtXQmky-l57zhLc9aCk02t1vS5TB9pzORL-fVNvnVoBKeZe5MnaKry2FAmoQUy/exec";

  const handleSubmit = useCallback(async () => {
    const data = {
      action: "",
      id: "",
      patientName: details.patientName,
      age: details.age,
      contact: details.contact,
      doctorName: details.doctorName,
      date: details.date,
      time: details.time,
    };

    if (isEditMode) {
      data.action = "editAppointment";
      data.id = userId;
    } else {
      data.action = "addAppointment";
    }

    const res = await fetch(APP_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (result.status === "success") {
      alert("Appointment saved successfully");
      setDetails({
        patientName: "",
        age: "",
        contact: "",
        doctorName: "",
        date: "",
        time: "",
      });
      setEditMode(false);
      setUserId(null);
      setIsstatus(false);
      fetchAppointments();
    }
  }, [details, isEditMode, userId]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const res = await fetch(`${APP_SCRIPT_URL}?action=getAppointments`, {
      method: "GET",
    });
    const result = await res.json();
    if (result.status === "success") {
      setInputs(result.result);
    }
  };

  const handleEdit = (appointments) => {
    setDetails({
      patientName: appointments.patientName,
      age: appointments.age,
      contact: appointments.contact,
      doctorName: appointments.doctorName,
      date: appointments.date,
      time: appointments.time,
    });
    setEditMode(true);
    setUserId(appointments.id);
    setIsstatus(true);
  };

  const handleReject = useCallback(
    async (appointmentId) => {
      try {
        const data = { action: "reject", id: appointmentId };
        const res = await fetch(APP_SCRIPT_URL, {
          method: "POST",
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (result.status === "success") fetchAppointments();
        else alert("Failed to reject appointment");
      } catch (error) {
        console.error("Error rejecting appointment:", error);
      }
    },
    [APP_SCRIPT_URL]
  );

  const handleApprove = useCallback(
    async (appointmentId) => {
      try {
        const data = { action: "approve", id: appointmentId };
        const res = await fetch(APP_SCRIPT_URL, {
          method: "POST",
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (result.status === "success") fetchAppointments();
        else alert("Failed to approve appointment");
      } catch (error) {
        console.error("Error approving appointment:", error);
      }
    },
    [APP_SCRIPT_URL]
  );

  return (
    <>
      <nav className="nav">
        <button className="addAppointment" onClick={() => setIsstatus(true)}>
          Add Appointment
        </button>
      </nav>
      <div className={`form-container ${isStatus || isEditMode ? "show" : ""}`}>
        <div className={`appointment-container ${isStatus || isEditMode ? "show" : ""}`}>
          <h3
            className="close-btn"
            onClick={() => {setDetails({
      patientName: "",
      age: "",
      contact: "",
      doctorName: "",
      date: "",
      time: "",
    });
              setIsstatus(false);
              setEditMode(false);
            }}
          >
            X
          </h3>
          <input
            type="text"
            required
            placeholder="Enter Patient Name"
            value={details.patientName}
            onChange={(e) => setDetails({ ...details, patientName: e.target.value })}
          />
          <input
            type="number"
            placeholder="Enter Patient Age"
            value={details.age}
            onChange={(e) => setDetails({ ...details, age: e.target.value })}
          />
          <input
            type="number"
            placeholder="Enter Patient Mobile Number"
            value={details.contact}
            onChange={(e) => setDetails({ ...details, contact: e.target.value })}
          />
          <input
            type="text"
            placeholder="Enter Doctor Name"
            value={details.doctorName}
            onChange={(e) => setDetails({ ...details, doctorName: e.target.value })}
          />
          <input
            type="date"
            placeholder="Select Date"
            value={details.date}
            onChange={(e) => setDetails({ ...details, date: e.target.value })}
          />
          <input
            type="time"
            placeholder="Select Time"
            value={details.time}
            onChange={(e) => setDetails({ ...details, time: e.target.value })}
          />
          {isEditMode ? (
            <button onClick={handleSubmit}>Save</button>
          ) : (
            <button onClick={handleSubmit}>Add</button>
          )}
        </div>
      </div>

      <div className="tables-container">
        <table className="table-container">
          <thead>
            <tr>
              <th>Id</th>
              <th>Patient Name</th>
              <th>Age</th>
              <th>Mobile Number</th>
              <th>Doctor Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inputs.map((elements, index) => (
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
                  <div className="handlingEvents">
                    {elements.status !== "Rejected" && elements.status !== "Approved" && (
                      <h4 className="approve" onClick={() => handleApprove(elements.id)}>
                        Approve
                      </h4>
                    )}
                    <h4 className="edit" onClick={() => handleEdit(elements)}>
                      Edit
                    </h4>
                    {elements.status !== "Rejected" && elements.status !== "Approved" && (
                      <h4 className="reject" onClick={() => handleReject(elements.id)}>
                        Reject
                      </h4>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminDashBoard;
