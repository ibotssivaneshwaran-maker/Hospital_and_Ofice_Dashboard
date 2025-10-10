import React, { useCallback, useState } from "react";

const ReceptionistDashboard = () => {
  const [details, setDetails] = useState({
    PatientName: "",
    Age: "",
    Contact: "",
    DoctorName: "",
    Date: "",
    Time: "",
  });
  const [inputs, setInputs] = useState([]);

 const handleSubmit = useCallback(async() => {
    const res=await fetch(APP_SCRIPT_URL,{
        method:"POST",
        body:JSON.stringify(details)
    })

    const result = await res.json()
    if(result === "success"){
        alert("added apppointment successfully")
    }
 })

  return (
    <>
      <div>
        <input
          type="text"
          placeholder="Enter PatientName"
          value={details.PatientName}
          onChange={(e) =>
            setDetails({ ...details, PatientName: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Enter Patient Age"
          value={details.Age}
          onChange={(e) => setDetails({ ...details, Age: e.target.value })}
        />
        <input
          type="number"
          placeholder="Enter Patient Mobile Number"
          value={details.Contact}
          onChange={(e) => setDetails({ ...details, Contact: e.target.value })}
        />
        <input
          type="text"
          placeholder="Enter Doctor Name"
          value={details.DoctorName}
          onChange={(e) =>
            setDetails({ ...details, DoctorName: e.target.value })
          }
        />
        <input
          type="Date"
          placeholder="Select Date"
          value={details.Date}
          onChange={(e) => setDetails({ ...details, Date: e.target.value })}
        />
        <input
          type="Time"
          placeholder="Select Time"
          value={details.Time}
          onChange={(e) => setDetails({ ...details, Time: e.target.value })}
        />
        <button onClick={handleSubmit}>Add</button>
      </div>
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
        <tbody>{}</tbody>
      </table>
    </>
  );
};

export default ReceptionistDashboard;
