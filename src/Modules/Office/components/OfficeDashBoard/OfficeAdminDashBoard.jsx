import React, { useEffect, useState } from "react";
import "../../../Hospital/components/CSS/adminDashBoard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OfficeAdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [interns, setInterns] = useState([]);
  const [taskDetails, setTaskDetails] = useState({
    taskId: "",
    title: "",
    description: "",
    assignedTo: "",
    deadline: "",
    status: "",
  });

  const APP_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbz0OLVtXQmky-l57zhLc9aCk02t1vS5TB9pzORL-fVNvnVoBKeZe5MnaKry2FAmoQUy/exec";

  const handleFetch = async () => {
    try {
      const response = await fetch(`${APP_SCRIPT_URL}?action=getTasks`);
      const res = await response.json();
      if (res.status === "success") {
        const allTasks = res.res || [];
        setTasks(allTasks);
      }
    } catch (err) {
      toast.error("Error fetching tasks.");
      console.error("Error fetching tasks:", err);
    }
  };

  const fetchInterns = async () => {
    try {
      const response = await fetch(`${APP_SCRIPT_URL}?action=getInterns`);
      const res = await response.json();
      if (res.status === "success" && Array.isArray(res.res)) {
        const names = res.res.map((item) => item.internName || item.name);
        setInterns(names);
      }
    } catch (err) {
      toast.error("Error fetching interns.");
      console.error("Error fetching interns:", err);
    }
  };

  useEffect(() => {
    handleFetch();
    fetchInterns();
  }, []);

  const handleAdd = async () => {
    if (
      !taskDetails.title ||
      !taskDetails.description ||
      !taskDetails.assignedTo ||
      !taskDetails.deadline
    ) {
      toast.warning("Please fill all fields!");
      return;
    }

    const data = {
      ...taskDetails,
      action: isEditMode ? "editTask" : "addTask",
    };

    try {
      const response = await fetch(APP_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(data),
      });
      const res = await response.json();

      if (res.status === "success") {
        toast.success(isEditMode ? "Task updated successfully!" : "Task added successfully!");
        setTaskDetails({
          taskId: "",
          title: "",
          description: "",
          assignedTo: "",
          deadline: "",
          status: "",
        });
        setIsEditMode(false);
        setShowForm(false);
        handleFetch();
      } else {
        toast.error("Error while saving task. Please try again.");
      }
    } catch (err) {
      console.error("Error adding task:", err);
      toast.error("Network error while saving task.");
    }
  };

  const handleEdit = (details) => {
    setTaskDetails({
      taskId: details.taskId,
      title: details.title,
      description: details.description,
      assignedTo: details.assignedTo,
      deadline: details.deadline,
      status: details.status || "",
    });
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const response = await fetch(APP_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({ action: "deleteTask", id }),
      });
      const res = await response.json();
      if (res.status === "success") {
        toast.success("Task deleted successfully!");
        handleFetch();
      } else {
        toast.error("Error deleting task.");
      }
    } catch (err) {
      console.error("Error deleting task:", err);
      toast.error("Network error while deleting task.");
    }
  };

  const st = ["Pending", "In Progress", "Completed"];

  const filteredTasks =
    localStorage.getItem("role") === "intern"
      ? tasks.filter(
          (task) =>
            task.assignedTo.toLowerCase().trim() ===
            localStorage.getItem("name").toLowerCase().trim()
        )
      : tasks;

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} theme="colored" />

      {localStorage.getItem("role") === "officeadmin" && (
        <nav className="nav">
          <button
            className="addAppointment"
            onClick={() => {
              setShowForm(true);
              setIsEditMode(false);
              setTaskDetails({
                taskId: "",
                title: "",
                description: "",
                assignedTo: "",
                deadline: "",
                status: "",
              });
            }}
          >
            Add Task
          </button>
        </nav>
      )}

      {showForm && (
        <div className="form-container show">
          <div className="appointment-container">
            <h3
              className="close-btn"
              onClick={() => {
                setShowForm(false);
                setTaskDetails({
                  taskId: "",
                  title: "",
                  description: "",
                  assignedTo: "",
                  deadline: "",
                  status: "",
                });
              }}
            >
              X
            </h3>

            <input
              type="text"
              value={taskDetails.title}
              onChange={(e) =>
                setTaskDetails({ ...taskDetails, title: e.target.value })
              }
              placeholder="Title"
            />

            <textarea
              value={taskDetails.description}
              onChange={(e) =>
                setTaskDetails({ ...taskDetails, description: e.target.value })
              }
              placeholder="Description"
            ></textarea>

            <div className="form-field">
              <select
                value={taskDetails.status}
                onChange={(e) =>
                  setTaskDetails({ ...taskDetails, status: e.target.value })
                }
              >
                <option value="">Select Status</option>
                {st.map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <select
                value={taskDetails.assignedTo}
                onChange={(e) =>
                  setTaskDetails({ ...taskDetails, assignedTo: e.target.value })
                }
              >
                <option value="">Select Intern</option>
                {interns.map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="date"
              value={taskDetails.deadline}
              onChange={(e) =>
                setTaskDetails({ ...taskDetails, deadline: e.target.value })
              }
              placeholder="Deadline"
            />

            <button onClick={handleAdd}>
              {isEditMode ? "Save Changes" : "Add Task"}
            </button>
          </div>
        </div>
      )}

      <h1 style={{ marginTop: "3rem" }}>
        {localStorage.getItem("name")} Dashboard
      </h1>

      <div className="tables-container">
        <table className="table-container">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Assigned To</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((element, index) => (
              <tr key={index}>
                <td>{element.title}</td>
                <td>{element.description}</td>
                <td>{element.assignedTo}</td>
                <td>{element.deadline}</td>
                <td>{element.status}</td>
                <td>
                  <div className="handlingEvents">
                    <h4 className="edit" onClick={() => handleEdit(element)}>
                      Edit
                    </h4>
                    {localStorage.getItem("role") === "officeadmin" && (
                      <h4
                        className="reject"
                        onClick={() => handleDelete(element.taskId)}
                      >
                        Delete
                      </h4>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default OfficeAdminDashboard;
