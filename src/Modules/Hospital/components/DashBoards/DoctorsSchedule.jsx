import React, { useCallback, useEffect, useState } from "react";
import '../CSS/adminDashBoard.css';

const DoctorsSchedule = () => {
    const [doctors, setDoctors] = useState([])
      const [isEditMode, setEditMode] = useState(false);
      const [userId, setUserId] = useState(null);
      const [isStatus, setIsstatus] = useState(false);
      const [details, setDetails] = useState({
        doctorName: "",
        doctorSpeciality: "",
       availableDays: "",
        availableTimeSlots: ""
      });
    
      const APP_SCRIPT_URL =
        "https://script.google.com/macros/s/AKfycbz0OLVtXQmky-l57zhLc9aCk02t1vS5TB9pzORL-fVNvnVoBKeZe5MnaKry2FAmoQUy/exec";
    
      const handleSubmit = useCallback(async () => {
        const data = {
          action: "",
          id: "",
          doctorName: details.doctorName,
        doctorSpeciality: details.doctorSpeciality,
       availableDays: details.availableDays,
        availableTimeSlots: details.availableTimeSlots
        };
    
        if (isEditMode) {
          data.action = "editDoctors";
          data.id = userId;
        } else {
          data.action = "addDoctors";
        }
    console.log(data.id)
        const res = await fetch(APP_SCRIPT_URL, {
          method: "POST",
          body: JSON.stringify(data),
        });
    
        const result = await res.json();
        if (result.status === "success") {
          alert("Doctors Added successfully");
          setDetails({
            doctorName: "",
        doctorSpeciality: "",
       availableDays: "",
        availableTimeSlots: ""
          });
          setEditMode(false);
          setUserId(null);
          setIsstatus(false);
          fetchDoctors();
        }
      }, [details, isEditMode, userId]);
    
      useEffect(() => {
        fetchDoctors();
      }, []);
    
      const fetchDoctors = async () => {
        const res = await fetch(`${APP_SCRIPT_URL}?action=getDoctors`, {
          method: "GET",
        });
        const result = await res.json();
        if (result.status === "success") {
         setDoctors(result.res);
        }
      };
    
      const handleEdit = (doctorDetails,index) => {
        setDetails({
          doctorName: doctorDetails.doctorName,
        doctorSpeciality: doctorDetails.doctorSpeciality,
       availableDays: doctorDetails.availableDays,
        availableTimeSlots: doctorDetails.availableTimeSlots
        });
        setEditMode(true);
        setUserId(index);
        setIsstatus(true);
      };
    
  return (
   <>
   <nav className="nav">
        {localStorage.getItem("role") !== "Staff" ?<button className="addAppointment" onClick={() => setIsstatus(true)}>
          Add Doctors
        </button>:null}
      </nav>
         <div className={`form-container ${isStatus || isEditMode ? "show" : ""}`}>
           <div className={`appointment-container ${isStatus || isEditMode ? "show" : ""}`}>
             <h3
               className="close-btn"
               onClick={() => {setDetails({
         doctorName: "",
        doctorSpeciality: "",
       availableDays: "",
        availableTimeSlots: ""
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
               placeholder="Enter Doctor Name"
               value={details.doctorName}
               onChange={(e) => setDetails({ ...details, doctorName: e.target.value })}
             />
             <input
               type="text"
               placeholder="Enter Specciality Of Doctor"
               value={details.doctorSpeciality}
               onChange={(e) => setDetails({ ...details, doctorSpeciality: e.target.value })}
             />
             <input
               type="text"
               placeholder="Enter Available Days"
               value={details.availableDays}
               onChange={(e) => setDetails({ ...details, availableDays: e.target.value })}
             />
             <input
               type="text"
               placeholder="Enter Available Time Slots"
               value={details.availableTimeSlots}
               onChange={(e) => setDetails({ ...details, availableTimeSlots: e.target.value })}
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
                <th>DoctorName</th>
                <th>Specialty</th>
                <th>AvailableDays</th>
                <th>AvailableTimeSlots</th>
                {localStorage.getItem("role") !== "Staff" ? <th>Action</th>:null}
               </tr>
             </thead>
             <tbody>
               {doctors.map((elements, index) => (
                 <tr key={index}>
                   <td>{elements.doctorName}</td>
                   <td>{elements.doctorSpeciality}</td>
                   <td>{elements.availableDays}</td>
                   <td>{elements.availableTimeSlots}</td>
                   {localStorage.getItem("role") !== "Staff" ? <td>
                     <div className="handlingEvents">
                       <h4 className="edit" onClick={() => handleEdit(elements,index+1)}>
                         Edit
                       </h4>
                     </div>
                   </td>:null}
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       </>
  )
}

export default DoctorsSchedule