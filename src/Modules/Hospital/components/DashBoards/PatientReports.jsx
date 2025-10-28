import React, { useCallback, useEffect, useState } from "react";
import "../CSS/adminDashBoard.css";

const PatientReports = () => {
  const [inputs, setInputs] = useState([]);
  const [isEditMode, setEditMode] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isStatus, setIsstatus] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [details, setDetails] = useState({
    patientName: "",
    doctorName: "",
    testType: "",
    reportLink: "",
    date: "",
  });

  const APP_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbz0OLVtXQmky-l57zhLc9aCk02t1vS5TB9pzORL-fVNvnVoBKeZe5MnaKry2FAmoQUy/exec";

  const handleSubmit = useCallback(async () => {
    const data = {
      action: "",
      id: "",
      patientName: details.patientName,
      doctorName: details.doctorName,
      testType: details.testType,
      reportLink: details.reportLink,
      date: details.date,
    };

    if (localStorage.getItem("role") === "Doctor")
      data.doctorName = localStorage.getItem("name");

    data.action = isEditMode ? "editReport" : "addReport";
    if (isEditMode) data.id = userId;

    const res = await fetch(APP_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(data),
    });
    const result = await res.json();

    if (result.status === "success") {
      alert(isEditMode ? "Report saved successfully" : "Report added successfully");
      setDetails({
        patientName: "",
        doctorName: "",
        testType: "",
        reportLink: "",
        date: "",
      });
      setEditMode(false);
      setUserId(null);
      setIsstatus(false);
      fetchReport();
    }
  }, [details, isEditMode, userId]);

  useEffect(() => {
    fetchReport();
    fetchAppointments(); // ✅ fetch doctor & patient names from appointments
  }, []);

  const fetchReport = async () => {
    const response = await fetch(`${APP_SCRIPT_URL}?action=getReports`);
    const result = await response.json();
    if (result.status === "success") {
      setInputs(result.res);
    }
  };

  // ✅ Fetch doctors & patients from Appointments with role-based filtering
  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${APP_SCRIPT_URL}?action=getAppointments`);
      const result = await response.json();
console.log(result)
      if (result.status === "success") {
        const role = localStorage.getItem("role");
        const currentUser = localStorage.getItem("name");

        const allDoctors = [
          ...new Set(result.result.map((i) => i.doctorName).filter(Boolean)),
        ];
        const allPatients = [
          ...new Set(result.result.map((i) => i.patientName).filter(Boolean)),
        ];

        // 👨‍⚕️ Doctor → only their patients
        if (role === "Doctor") {
          const filteredPatients = [
            ...new Set(
              result.result
                .filter((i) => i.doctorName === currentUser)
                .map((i) => i.patientName)
                .filter(Boolean)
            ),
          ];
          setDoctors([currentUser]);
          setPatients(filteredPatients);
        }
        // 🧑‍💼 Admin → all
        else {
          setDoctors(allDoctors);
          setPatients(allPatients);
        }
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  const handleEdit = (reports) => {
    setDetails({
      patientName: reports.patientName,
      doctorName: reports.doctorName,
      testType: reports.testType,
      reportLink: reports.reportLink,
      date: reports.date,
    });
    setEditMode(true);
    setUserId(reports.id);
    setIsstatus(true);
  };

  const handleDelete = async (id) => {
    const data = { action: "deleteReport", id };
    const res = await fetch(APP_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(data),
    });
    const response = await res.json();
    if (response.status === "success") {
      alert("Report deleted successfully!");
      fetchReport();
    } else {
      alert("Failed to delete report.");
    }
  };

  return (
    <div className="patient-reports">
      <nav className="nav">
        {localStorage.getItem("role") !== "Staff" && (
          <button className="addAppointment" onClick={() => setIsstatus(true)}>
            Add Reports
          </button>
        )}
      </nav>

      <div className={`form-container ${isStatus || isEditMode ? "show" : ""}`}>
        <div className={`appointment-container ${isStatus || isEditMode ? "show" : ""}`}>
          <h3
            className="close-btn"
            onClick={() => {
              setDetails({
                patientName: "",
                doctorName: "",
                testType: "",
                reportLink: "",
                date: "",
              });
              setIsstatus(false);
              setEditMode(false);
            }}
          >
            X
          </h3>

          <div className="form-field">
            <label>Patient Name</label>
            <select
              value={details.patientName}
              onChange={(e) => setDetails({ ...details, patientName: e.target.value })}
            >
              <option value="">-- Select Patient --</option>
              {patients.map((p, i) => (
                <option key={i} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Doctor Name</label>
            {localStorage.getItem("role") === "Admin" ? (
              <select
                value={details.doctorName}
                onChange={(e) => setDetails({ ...details, doctorName: e.target.value })}
              >
                <option value="">-- Select Doctor --</option>
                {doctors.map((d, i) => (
                  <option key={i} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={localStorage.getItem("name")}
                readOnly
              />
            )}
          </div>

          <div className="form-field">
            <label>Test Type</label>
            <input
              type="text"
              placeholder="Enter Test Type"
              value={details.testType}
              onChange={(e) => setDetails({ ...details, testType: e.target.value })}
            />
          </div>

          <div className="form-field">
            <label>Report Link</label>
            <input
              type="text"
              placeholder="Enter Report Link"
              value={details.reportLink}
              onChange={(e) => setDetails({ ...details, reportLink: e.target.value })}
            />
          </div>

          <div className="form-field">
            <label>Date</label>
            <input
              type="date"
              value={details.date}
              onChange={(e) => setDetails({ ...details, date: e.target.value })}
            />
          </div>

          <button onClick={handleSubmit}>{isEditMode ? "Save" : "Add"}</button>
        </div>
      </div>

      <div className="tables-container">
        <table className="table-container">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Doctor Name</th>
              <th>Test Type</th>
              <th>Report Link</th>
              <th>Date</th>
              {localStorage.getItem("role") !== "Staff" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {inputs
              .filter((e) => {
                const role = localStorage.getItem("role");
                if (role === "Doctor") return e.doctorName === localStorage.getItem("name");
                return true; // Admin & Staff see all
              })
              .map((e, i) => (
                <tr key={i}>
                  <td>{e.patientName}</td>
                  <td>{e.doctorName}</td>
                  <td>{e.testType}</td>
                  <td>
                    <a href={e.reportLink} target="_blank" rel="noopener noreferrer">
                      View Report
                    </a>
                  </td>
                  <td>{e.date}</td>
                  {localStorage.getItem("role") !== "Staff" && (
                    <td>
                      <div className="handlingEvents">
                        <h4 className="edit" onClick={() => handleEdit(e)}>
                          Edit
                        </h4>
                        <h4 className="reject" onClick={() => handleDelete(e.id)}>
                          Delete
                        </h4>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientReports;