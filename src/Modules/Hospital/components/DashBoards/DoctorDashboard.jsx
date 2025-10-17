import React, { useCallback, useEffect, useState } from "react"
import "../CSS/adminDashBoard.css"

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([])
  const [popUp, setPopUp] = useState(false)
  const [notes, setNotes] = useState("")
  const [userId, setUserId] = useState(0)
     const [isStatus, setIsstatus] = useState(false)
     const [isEditMode, setEditMode] = useState(false)
   const [details, setDetails] = useState({
     patientName: "",
     age: "",
     contact: "",
     doctorName: "",
     date: "",
     time: "",
   })

  const APP_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbz0OLVtXQmky-l57zhLc9aCk02t1vS5TB9pzORL-fVNvnVoBKeZe5MnaKry2FAmoQUy/exec"

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${APP_SCRIPT_URL}?action=getAppointments`)
      const result = await res.json()
      if (result.status === "success") {
        setAppointments(result.result)
      }
    } catch (error) {
      console.error("Failed to fetch appointments:", error)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  const handleApprove = useCallback(
    async (appointmentId) => {
      try {

        const data = {
          action:"approve",
          id:appointmentId
        }
        const res = await fetch(APP_SCRIPT_URL, {
          method: "POST",
          body: JSON.stringify(data),
        })

        const result = await res.json()

        if (result.status === "success") {
          fetchAppointments()
        } else {
          alert("Failed to approve appointment")
        }
      } catch (error) {
        console.error("Error approving appointment:", error)
      }
    },
    [APP_SCRIPT_URL]
  )
 const handleSubmit = useCallback(async () => {
    const data = {
        action:"",
        id:"",
        patientName:details.patientName,
        age:details.age,
        contact:details.contact,
        doctorName:details.doctorName,
        date:details.date,
        time:details.time,
      }
    if(isEditMode){
      data.action = "editAppointment"
       data.id = userId
    }
    else{
      data.action = "addAppointment"
    }
 
     const res = await fetch(APP_SCRIPT_URL, {
       method: "POST",
       body: JSON.stringify(data),
     })
 
     const result = await res.json()
     if (result.status === "success") {
       alert("added apppointment successfully")
       setDetails({
         patientName: "",
         age: "",
         contact: "",
         doctorName: "",
         date: "",
         time: "",
       })
       setEditMode(false)
       setUserId(null)
       setIsstatus(false)
       fetchAppointments()
     }
   },[details,isEditMode,userId])
  const handleReject = useCallback(
    async (appointmentId) => {
      try {
        const data = {
          action:"reject",
          id:appointmentId
        }

        const res = await fetch(APP_SCRIPT_URL, {
          method: "POST",
          body: JSON.stringify(data),
        })

        const result = await res.json()

        if (result.status === "success") {
          alert("successs")
          fetchAppointments()
        } else {
          alert("Failed to reject appointment")
        }
      } catch (error) {
        console.error("Error rejecting appointment:", error)
      }
    },
    [APP_SCRIPT_URL]
  )

  const handlePopUp = (id) => {
    setPopUp(true)
    setUserId(id)
  }

   const handleEdit = (appointments) => {
    setDetails({
      patientName:appointments.patientName,
      age:appointments.age,
      contact:appointments.contact,
      doctorName:appointments.doctorName,
      date:appointments.date,
      time:appointments.time
    })
    setEditMode(true)
    setUserId(appointments.id)
   }

  const handleNotes = async () => {
    try {

      const data = {
          action:"notes",
          notes:notes,
          id:userId
        }
      const response = await fetch(APP_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(data),
      })

      const res = await response.json()
      if (res.status === "success") {
        alert("success")
        fetchAppointments()
        setNotes("")
        setPopUp(false)
      }
    } catch (error) {
      console.error("Error adding notes:", error)
    }
  }

  return (
    <div>
      <div className="form-container">
        {isStatus || isEditMode ? <div className='appointment-container'>
          <h3 className="close-btn" onClick={() => setIsstatus(false)}>
              X
            </h3>
         <input
           type="text"
           required
           placeholder="Enter PatientName"
           value={details.patientName}
           onChange={(e) =>
             setDetails({ ...details, patientName: e.target.value })
           }
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
           onChange={(e) =>
             setDetails({ ...details, doctorName: e.target.value })
           }
         />
         <input
           type="Date"
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
         {isEditMode ? <button onClick={handleSubmit}>Save</button>:<button onClick={handleSubmit}>Add</button>}
       </div>:null}
       </div>
      <h2>Doctor Dashboard</h2>
      <div className="tables-container">
        <table className="table-container">
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
                <div className="notes-container">
                  {!appointment.notes ? (
                  <button onClick={() => handlePopUp(appointment.id)}>
                    Add Notes
                  </button>
                ) : (
                  <p>{appointment.notes}</p>
                )}
                </div>
              </td>
              <td>
                  <div className='handlingEvents'>
                    {appointment.status !== "Rejected" && appointment.status !== "Approved" ? <h4 className='approve' onClick={() => handleApprove(appointment.id)}>
                      Approve
                    </h4>:null}
                    <h4 className='edit' onClick={() => handleEdit(appointment)}>
                      Edit
                    </h4>
                    {appointment.status !== "Rejected" && appointment.status !== "Approved" ? <h4 className='reject' onClick={() => handleReject(appointment.id)}>
                      Reject
                    </h4> : null}
                  </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {popUp && (
        <div className="popup-overlay">
          <div className="popup-container">
            <h3 className="close-btn" onClick={() => setPopUp(false)}>
              X
            </h3>
            <h2>Add Notes</h2>
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
  )
}

export default DoctorDashboard
