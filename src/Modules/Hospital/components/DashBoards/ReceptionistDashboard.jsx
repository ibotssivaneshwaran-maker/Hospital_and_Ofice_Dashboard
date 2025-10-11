import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ReceptionistDashboard = () => {
  const sendData = new URLSearchParams();
  const [inputs, setInputs] = useState([])
  const [details, setDetails] = useState({
    patientName: "",
    age: "",
    contact: "",
    doctorName: "",
    date: "",
    time: "",
  });
  const APP_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyxnrwdz-AEoDY6IYeyiOWnlw0Zb7dcapMvDAHmf3OeCw9loYELF_BsPdYPP2T8pCO7/exec";
  const handleSubmit = useCallback(async () => {
    sendData.append("action", "addAppointment");
    sendData.append("patientName", `${details.patientName}`);
    sendData.append("age", `${details.age}`);
    sendData.append("contact", `${details.contact}`);
    sendData.append("doctorName", `${details.doctorName}`);
    sendData.append("date", `${details.date}`);
    sendData.append("time", `${details.time}`);

    const res = await fetch(APP_SCRIPT_URL, {
      method: "POST",
      body: sendData,
    });

    const result = await res.json();
    if (result.status === "success") {
      alert("added apppointment successfully");
      setDetails({
        patientName: "",
        age: "",
        contact: "",
        doctorName: "",
        date: "",
        time: "",
      });
      fetchAppointments()
    }
  },[details]);

  useEffect(() => {
    fetchAppointments()
  },[])

  const fetchAppointments = async() => {
    const res = await fetch(`${APP_SCRIPT_URL}?action=getAppointments`,{
      method:"GET"
    })
    const result = await res.json()
    if(result.status === "success"){
      setInputs(result.result)
    }
  }
  return (
    <>
      <div>
        <input
          type="text"
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
          type="Time"
          placeholder="Select Time"
          value={details.time}
          onChange={(e) => setDetails({ ...details, time: e.target.value })}
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
        <tbody>{inputs.map((elements,index) => (
          <tr key={index}>
            <td>{index+1}</td>
            <td>{elements.patientName}</td>
            <td>{elements.age}</td>
            <td>{elements.contact}</td>
            <td>{elements.doctorName}</td>
            <td>{elements.date}</td>
            <td>{elements.time}</td>
            <td>{elements.status}</td>
          </tr>
        ))}</tbody>
      </table>
    </>
  );
};

export default ReceptionistDashboard;
