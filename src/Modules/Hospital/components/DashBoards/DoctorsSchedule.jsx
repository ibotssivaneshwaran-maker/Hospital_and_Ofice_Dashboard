import React, { useCallback, useEffect, useState } from "react";
import "../CSS/adminDashBoard.css";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DoctorsSchedule = () => {
  const [doctors, setDoctors] = useState([]);
  const [isEditMode, setEditMode] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isStatus, setIsstatus] = useState(false);
  const [details, setDetails] = useState({
    doctorName: "",
    doctorSpeciality: "",
    availableDays: "",
    availableTimeSlots: "",
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

  const handleSubmit = useCallback(async () => {
    const actionType = isEditMode ? "editDoctors" : "addDoctors";

    const data = {
      action: actionType,
      id: isEditMode ? userId : "",
      doctorName: details.doctorName,
      doctorSpeciality: details.doctorSpeciality,
      availableDays: details.availableDays,
      availableTimeSlots: details.availableTimeSlots,
    };
    try {
      const res = await fetch(APP_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.status === "success") {
        notify(
          isEditMode
            ? "Doctor details updated successfully!"
            : "Doctor added successfully!",
          "success"
        );

        setDetails({
          doctorName: "",
          doctorSpeciality: "",
          availableDays: "",
          availableTimeSlots: "",
        });
        setEditMode(false);
        setUserId(null);
        setIsstatus(false);
        fetchDoctors();
      } else {
        notify(result.message || "Failed to save doctor details", "error");
      }
    } catch (err) {
      notify("Network or fetch error", "error");
    }
  }, [details, isEditMode, userId]);

  const fetchDoctors = async () => {
    try {
      const res = await fetch(`${APP_SCRIPT_URL}?action=getDoctors`);
      const result = await res.json();
      if (result.status === "success") {
        setDoctors(result.res);
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);
  useEffect(() => {
  if (localStorage.getItem("role") === "Doctor") {
    setDetails((prev) => ({
      ...prev,
      doctorName: localStorage.getItem("name"),
    }));
  }
}, [isStatus]);

  const handleEdit = (doctorDetails) => {
    setDetails({
      doctorName: doctorDetails.doctorName,
      doctorSpeciality: doctorDetails.doctorSpeciality,
      availableDays: doctorDetails.availableDays,
      availableTimeSlots: doctorDetails.availableTimeSlots,
    });
    setEditMode(true);
    setUserId(doctorDetails.doctorID);
    setIsstatus(true);
  };

  const handleDelete = async (doctorID) => {
    try {
      const res = await fetch(APP_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({ action: "deleteDoctors", id: doctorID }),
      });

      const response = await res.json();

      if (response.status === "success") {
        notify("Doctor deleted successfully!", "success");
        fetchDoctors();
      } else {
        notify("Failed to delete doctor", "error");
      }
    } catch (err) {
      notify("Network or fetch error", "error");
    }
  };

  return (
    <>
      <nav className="nav">
        {localStorage.getItem("role") !== "Staff" && (
          <button className="addAppointment" onClick={() => setIsstatus(true)}>
            Add Doctors
          </button>
        )}
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
                doctorName: "",
                doctorSpeciality: "",
                availableDays: "",
                availableTimeSlots: "",
              });
              setIsstatus(false);
              setEditMode(false);
            }}
          >
            X
          </h3>

          {localStorage.getItem("role") === "Doctor" ? (
  <input
    type="text"
    value={details.doctorName || localStorage.getItem("name")}
    readOnly
  />
): (
            <input
              type="text"
              required = {true}
              placeholder="Enter Doctor Name"
              readOnly={isEditMode}
              value={details.doctorName}
              onChange={(e) =>
                setDetails({ ...details, doctorName: e.target.value })
              }
            />
          )}

          <input
            type="text"
            placeholder="Enter Specialty of Doctor"
            value={details.doctorSpeciality}
            onChange={(e) =>
              setDetails({ ...details, doctorSpeciality: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Enter Available Days"
            value={details.availableDays}
            onChange={(e) =>
              setDetails({ ...details, availableDays: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Enter Available Time Slots"
            value={details.availableTimeSlots}
            onChange={(e) =>
              setDetails({ ...details, availableTimeSlots: e.target.value })
            }
          />

          <button onClick={handleSubmit}>
            {isEditMode ? "Save" : "Add"}
          </button>
        </div>
      </div>

      <div className="tables-container">
        <table className="table-container">
          <thead>
            <tr>
              <th>Doctor Name</th>
              <th>Specialty</th>
              <th>Available Days</th>
              <th>Available Time Slots</th>
              {localStorage.getItem("role") !== "Staff" && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {(localStorage.getItem("role") === "Doctor"
              ? doctors.filter(
                  (app) => app.doctorName === localStorage.getItem("name")
                )
              : doctors
            ).map((elements, index) => (
              <tr key={index}>
                <td>{elements.doctorName}</td>
                <td>{elements.doctorSpeciality}</td>
                <td>{elements.availableDays}</td>
                <td>{elements.availableTimeSlots}</td>
                {localStorage.getItem("role") !== "Staff" && (
                  <td>
                    <div className="handlingEvents">
                      <h4
                        className="edit"
                        onClick={() => handleEdit(elements)}
                      >
                        Edit
                      </h4>
                      <h4
                        className="reject"
                        onClick={() => handleDelete(elements.doctorID)}
                      >
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

      <ToastContainer />
    </>
  );
};

export default DoctorsSchedule;
