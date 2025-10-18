import { useCallback, useEffect, useState } from "react";

const ReceptionistDashboard = () => {
  const [inputs, setInputs] = useState([]);
  const [isStatus, setIsStatus] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
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

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${APP_SCRIPT_URL}?action=getAppointments`);
      const result = await res.json();
      if (result.status === "success") setInputs(result.result);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleSubmit = useCallback(async () => {
    const data = {
      action: "addAppointment",
      id: "",
      patientName: details.patientName,
      age: details.age,
      contact: details.contact,
      doctorName: details.doctorName,
      date: details.date,
      time: details.time,
    };

    try {
      const res = await fetch(APP_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (result.status === "success") {
        alert("Appointment added successfully!");
        setDetails({
          patientName: "",
          age: "",
          contact: "",
          doctorName: "",
          date: "",
          time: "",
        });
        setIsStatus(false);
        setEditMode(false);
        fetchAppointments();
      }
    } catch (err) {
      console.error("Error adding appointment:", err);
    }
  }, [details]);

  return (
    <>
      <h1>Staff Dashboard</h1>
      <nav className="nav">
        <button className="addAppointment" onClick={() => setIsStatus(true)}>
          Add Appointment
        </button>
      </nav>

      <div className={`form-container ${isStatus || isEditMode ? "show" : ""}`}>
        <div className="appointment-container">
          <h3 className="close-btn" onClick={() => setIsStatus(false)}>
            X
          </h3>
          <input
            type="text"
            placeholder="Enter Patient Name"
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
            onChange={(e) =>
              setDetails({ ...details, contact: e.target.value })
            }
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
          <button onClick={handleSubmit}>{isEditMode ? "Save" : "Add"}</button>
        </div>
      </div>

      <div className="tables-container">
        <table className="table-container">
          <thead>
            <tr>
              <th>Id</th>
              <th>Patient Name</th>
              <th>Patient Age</th>
              <th>Patient Mobile Number</th>
              <th>Doctor Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {inputs.map((el, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{el.patientName}</td>
                <td>{el.age}</td>
                <td>{el.contact}</td>
                <td>{el.doctorName}</td>
                <td>{el.date}</td>
                <td>{el.time}</td>
                <td>{el.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ReceptionistDashboard;
