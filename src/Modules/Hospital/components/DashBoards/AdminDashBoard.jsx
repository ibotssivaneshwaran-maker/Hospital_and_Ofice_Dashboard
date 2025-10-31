import React, { useCallback, useEffect, useState } from "react";
import "../CSS/adminDashBoard.css";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDashBoard = () => {
  const [inputs, setInputs] = useState([]);
  const [isEditMode, setEditMode] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isStatus, setIsstatus] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [isNoteFormVisible, setNoteFormVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [noteText, setNoteText] = useState("");

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

  const notify = (msg, type = "info") => {
    toast[type](msg, {
      position: "top-right",
      autoClose: 2500,
      transition: Slide,
      theme: "colored",
    });
  };

  // ✅ Submit form
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

    if (localStorage.getItem("role") === "Doctor") {
      data.doctorName = localStorage.getItem("name");
    }

    data.action = isEditMode ? "editAppointment" : "addAppointment";
    if (isEditMode) data.id = userId;

    const res = await fetch(APP_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (result.status === "success") {
      notify(
        isEditMode
          ? "Appointment updated successfully"
          : "Appointment added successfully",
        "success"
      );
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
    } else {
      notify("Failed to save appointment", "error");
    }
  }, [details, isEditMode, userId]);

  // ✅ Fetch appointments & doctors
  const fetchAppointments = useCallback(async () => {
    try {
      const res = await fetch(`${APP_SCRIPT_URL}?action=getAppointments`);
      const result = await res.json();

      if (result.status === "success") {
        let allAppointments = result.result || [];

        if (localStorage.getItem("role") === "Doctor") {
          const doctorName = localStorage.getItem("name");
          allAppointments = allAppointments.filter(
            (appt) =>
              appt.doctorName &&
              appt.doctorName.trim().toLowerCase() ===
                doctorName.trim().toLowerCase()
          );
        }

        setInputs(allAppointments);
      }

      const doctorRes = await fetch(`${APP_SCRIPT_URL}?action=getDoctors`);
      const doctorResult = await doctorRes.json();

      if (doctorResult.status === "success" && doctorResult.res) {
        const uniqueDoctors = [
          ...new Set(doctorResult.res.map((doc) => doc.doctorName.trim())),
        ].sort((a, b) => a.localeCompare(b));
        setDoctors(uniqueDoctors);
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
      notify("Error fetching appointments", "error");
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
    if (localStorage.getItem("role") === "Doctor") {
      setDetails((prev) => ({
        ...prev,
        doctorName: localStorage.getItem("name"),
      }));
    }
  }, [fetchAppointments]);

  // ✅ Edit handler
  const handleEdit = (appointment) => {
    setDetails({
      patientName: appointment.patientName,
      age: appointment.age,
      contact: appointment.contact,
      doctorName: appointment.doctorName,
      date: appointment.date,
      time: appointment.time,
    });
    setEditMode(true);
    setUserId(appointment.id);
    setIsstatus(true);
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    const data = { action: "reject", id };
    const res = await fetch(APP_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(data),
    });
    const response = await res.json();
    if (response.status === "success") {
      notify("Appointment deleted successfully", "success");
      fetchAppointments();
    } else notify("Failed to delete appointment", "error");
  };

  // ✅ Approve
  const handleApprove = async (appointmentId) => {
    const data = { action: "approve", id: appointmentId };
    const res = await fetch(APP_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.status === "success") {
      notify("Appointment approved!", "success");
      fetchAppointments();
    } else notify("Failed to approve appointment", "error");
  };

  // ✅ Add note
  const handleAddNoteClick = (patient) => {
    setSelectedPatient(patient);
    setNoteFormVisible(true);
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return notify("Please enter a note", "warning");

    const data = {
      action: "notes",
      id: selectedPatient.id,
      notes: noteText,
    };

    const res = await fetch(APP_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(data),
    });
    const result = await res.json();

    if (result.status === "success") {
      notify("Note added successfully!", "success");
      setNoteFormVisible(false);
      setNoteText("");
      setSelectedPatient(null);
      fetchAppointments();
    } else notify("Failed to add note", "error");
  };

  return (
    <>
      <nav className="nav">
        <button className="addAppointment" onClick={() => setIsstatus(true)}>
          Add Appointment
        </button>
      </nav>

      {/* ✅ Appointment Form */}
      <div className={`form-container ${isStatus || isEditMode ? "show" : ""}`}>
        <div className="appointment-container">
          <h3
            className="close-btn"
            onClick={() => {
              setDetails({
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
            onChange={(e) =>
              setDetails({ ...details, patientName: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Enter Age"
            value={details.age}
            onChange={(e) => setDetails({ ...details, age: e.target.value })}
          />

          <input
            type="number"
            placeholder="Enter Mobile Number"
            value={details.contact}
            onChange={(e) =>
              setDetails({ ...details, contact: e.target.value })
            }
          />

          <div className="form-field">
            {localStorage.getItem("role") === "Admin" ||
            (localStorage.getItem("role") === "Staff" && !isEditMode) ? (
              <select
                value={details.doctorName}
                onChange={(e) =>
                  setDetails({ ...details, doctorName: e.target.value })
                }
              >
                <option value="">-- Select a Doctor --</option>
                {doctors.map((doctor, index) => (
                  <option key={index} value={doctor}>
                    {doctor}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                placeholder="Enter Doctor Name"
                value={details.doctorName}
                readOnly={
                  isEditMode || localStorage.getItem("role") === "Doctor"
                }
                onChange={(e) =>
                  setDetails({ ...details, doctorName: e.target.value })
                }
              />
            )}
          </div>

          <input
            type="date"
            value={details.date}
            onChange={(e) => setDetails({ ...details, date: e.target.value })}
          />

          <input
            type="time"
            value={details.time}
            onChange={(e) => setDetails({ ...details, time: e.target.value })}
          />

          <button onClick={handleSubmit}>
            {isEditMode ? "Save" : "Add"}
          </button>
        </div>
      </div>

      {/* ✅ Table Section */}
      <div className="tables-container">
        <table className="table-container">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Age</th>
              <th>Contact</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Notes</th>
              <th>Status</th>
              {localStorage.getItem("role") !== "Staff" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {inputs.map((row, i) => (
              <tr key={i}>
                <td>{row.patientName}</td>
                <td>{row.age}</td>
                <td>{row.contact}</td>
                <td>{row.doctorName}</td>
                <td>{row.date}</td>
                <td>{row.time}</td>

                {/* ✅ FIXED hydration issue */}
                {localStorage.getItem("role") !== "Staff" ? (
                  <td>
                    {row.notes ? (
                      row.notes
                    ) : (
                      <button
                        className="addNotes"
                        onClick={() => handleAddNoteClick(row)}
                      >
                        Add Note
                      </button>
                    )}
                  </td>
                ) : (
                  <td>{row.notes ? row.notes : "-"}</td>
                )}

                <td>{row.status}</td>

                {localStorage.getItem("role") !== "Staff" && (
                  <td>
                    <div className="handlingEvents">
                      <h4 className="edit" onClick={() => handleEdit(row)}>
                        Edit
                      </h4>
                      <h4
                        className="reject"
                        onClick={() => handleDelete(row.id)}
                      >
                        Delete
                      </h4>
                      {row.status !== "Approved" && (
                        <h4
                          className="approve"
                          onClick={() => handleApprove(row.id)}
                        >
                          Approve
                        </h4>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Notes Popup */}
      {isNoteFormVisible && (
        <div className="popup-overlay">
          <div className="popup-container">
            <h3 className="close-btn" onClick={() => setNoteFormVisible(false)}>
              X
            </h3>
            <h2>Add Note for {selectedPatient?.patientName}</h2>
            <form onSubmit={handleSaveNote}>
              <textarea
                placeholder="Enter your note..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              ></textarea>
              <button type="submit">Save Note</button>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </>
  );
};

export default AdminDashBoard;
