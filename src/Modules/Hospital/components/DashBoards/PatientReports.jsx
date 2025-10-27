import React, { useCallback, useEffect, useState } from "react"

const PatientReports = () => {
  const [inputs, setInputs] = useState([])
  const [isEditMode, setEditMode] = useState(false)
  const [userId, setUserId] = useState(null)
  const [isStatus, setIsstatus] = useState(false)
  const [details, setDetails] = useState({
    patientName: "",
    doctorName: "",
    testType: "",
    reportLink: "",
    date: "",
  })
  const APP_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbz0OLVtXQmky-l57zhLc9aCk02t1vS5TB9pzORL-fVNvnVoBKeZe5MnaKry2FAmoQUy/exec"

  const handleSubmit = useCallback(async () => {
    const data = {
      action: "",
      id: "",
      patientName: details.patientName,
      doctorName: details.doctorName,
      testType: details.testType,
      reportLink: details.reportLink,
      date: details.date,
    }

    if (isEditMode) {
      data.action = "editReport"
      data.id = userId
    } else {
      data.action = "addReport"
    }
    console.log(data.patientName)
    const res = await fetch(APP_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(data),
    })

    const result = await res.json()
    console.log(result)
    if (result.status === "success") {
      isEditMode
        ? alert("Report saved successfully")
        : alert("Report Added successfully")
      setDetails({
        patientName: "",
        doctorName: "",
        testType: "",
        reportLink: "",
        date: "",
      })
      setEditMode(false)
      setUserId(null)
      setIsstatus(false)
      fetchReport()
    }
  }, [details, isEditMode, userId])
  useEffect(() => {
    fetchReport()
  }, [])

  const fetchReport = async () => {
    const response = await fetch(`${APP_SCRIPT_URL}?action=getReports`, {
      method: "GET",
    })
    const result = await response.json()
    if (result.status === "success") {
      setInputs(result.res)
    }
  }
   const handleEdit = (reports) => {
    setDetails({
      patientName: reports.patientName,
      testType: reports.testType,
      reportLink: reports.reportLink,
      doctorName: reports.doctorName,
      date: reports.date,
    })
    setEditMode(true)
    setUserId(reports.id)
    setIsstatus(true)
  }

  const handleDelete = async (id) => {
  try {
    const data = { action: "deleteReport", id: id }
    const res = await fetch(APP_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(data),
    })
    const response = await res.json()
    if (response.status === "success") {
      alert("Report deleted successfully!")
      fetchReport()
    } else {
      alert("Failed to delete report.")
    }
  } catch (error) {
    console.error("Error deleting report:", error)
  }
}

  return (
    <>
      <nav className="nav">
        <button className="addAppointment" onClick={() => setIsstatus(true)}>
          Add Reports
        </button>
      </nav>
      <div className={`form-container ${isStatus || isEditMode ? "show" : ""}`}>
        <div
          className={`appointment-container ${
            isStatus || isEditMode ? "show" : ""
          }`}
        >
          <h3
            className="close-btn"
            onClick={() => {
              setDetails({
                patientName: "",
                doctorName: "",
                testType: "",
                reportLink: "",
                date: "",
              })
              setIsstatus(false)
              setEditMode(false)
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
            type="text"
            placeholder="Enter  DoctorName"
            value={details.doctorName}
            onChange={(e) =>
              setDetails({ ...details, doctorName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Enter testType"
            value={details.testType}
            onChange={(e) =>
              setDetails({ ...details, testType: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Enter ReportLink"
            value={details.reportLink}
            onChange={(e) =>
              setDetails({ ...details, reportLink: e.target.value })
            }
          />
          <input
            type="date"
            placeholder="Select Date"
            value={details.date}
            onChange={(e) => setDetails({ ...details, date: e.target.value })}
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
              <th>Patient Name</th>
              <th>Doctor Name</th>
              <th>Test Type</th>
              <th>ReportLink</th>
              <th>Date</th>
              {localStorage.getItem("role") !== "Staff" ? (
                <th>Actions</th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {localStorage.getItem("role") === "Doctor"
              ? inputs
                  .filter(
                    (app) => app.doctorName == localStorage.getItem("name")
                  )
                  .map((elements, index) => (
                    <tr key={index}>
                      <td>{elements.patientName}</td>
                      <td>{elements.doctorName}</td>
                      <td>{elements.testType}</td>
                      <td>{elements.reportLink}</td>
                      <td>{elements.date}</td>
                      {localStorage.getItem("role") !== "Staff" ? (
                        <td>
                          <div className="handlingEvents">
                            <h4
                              className="edit"
                              onClick={() => handleEdit(elements)}
                            >
                              Edit
                            </h4>
                            {elements.status !== "Approved" && (
                              <h4
                                className="reject"
                                onClick={() => handleDelete(elements.id)}
                              >
                                Delete
                              </h4>
                            )}
                          </div>
                        </td>
                      ) : null}
                    </tr>
                  ))
              :inputs.map((elements, index) => (
                    <tr key={index}>
                      <td>{elements.patientName}</td>
                      <td>{elements.doctorName}</td>
                      <td>{elements.testType}</td>
                      <td>{elements.reportLink}</td>
                      <td>{elements.date}</td>
                      {localStorage.getItem("role") !== "Staff" ? (
                        <td>
                          <div className="handlingEvents">
                            <h4
                              className="edit"
                              onClick={() => handleEdit(elements)}
                            >
                              Edit
                            </h4>
                            {elements.status !== "Approved" && (
                              <h4
                                className="reject"
                                onClick={() => handleDelete(elements.id)}
                              >
                                Delete
                              </h4>
                            )}
                          </div>
                        </td>
                      ) : null}
                    </tr>
                  ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default PatientReports
