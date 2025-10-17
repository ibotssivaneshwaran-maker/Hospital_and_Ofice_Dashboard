import { useCallback, useEffect, useState } from "react";

const ReceptionistDashboard = () => {
  const [inputs, setInputs] = useState([])
  const [isStatus, setIsstatus] = useState(false)
     const [isEditMode, setEditMode] = useState(false)
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
        action:"addAppointment",
        id:"",
        patientName:details.patientName,
        age:details.age,
        contact:details.contact,
        doctorName:details.doctorName,
        date:details.date,
        time:details.time,
      }

    const res = await fetch(APP_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(data),
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
      setEditMode(false);
  setIsstatus(false);
  setUserId(null);
  fetchAppointments();
    }
  },[details,isEditMode]);

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
    <h1>Staff DashBoard</h1>
      <nav className='nav'>
          <button className='addAppointment'onClick={() => setIsstatus(true)}>Add Appointment</button>
       </nav>
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
      <div className="tables-container">
        <table className="table-container">
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
      </div>
    </>
  );
};

export default ReceptionistDashboard;
