import React, { useEffect, useState } from "react";

const OfficeAdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [taskDetails, setTaskDetails] = useState({
    taskId: "",
    title: "",
    description: "",
    assignedTo: "",
    deadline: "",
  });

  const APP_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbz0OLVtXQmky-l57zhLc9aCk02t1vS5TB9pzORL-fVNvnVoBKeZe5MnaKry2FAmoQUy/exec";

  const handleFetch = async () => {
    const response = await fetch(`${APP_SCRIPT_URL}?action=getTasks`);
    const res = await response.json();
    if (res.status === "success") {
      setTasks(res.res || res.result || []); // fallback if API returns different key
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  const handleAdd = async () => {
    const data = {
      ...taskDetails,
      action: isEditMode ? "editTask" : "addTask",
    };

    const response = await fetch(APP_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(data),
    });
    const res = await response.json();
console.log(res.status)
    if (res.status === "success") {
      alert(isEditMode ? "Task updated successfully!" : "Task added successfully!");
      setTaskDetails({
        taskId: "",
        title: "",
        description: "",
        assignedTo: "",
        deadline: "",
      });
      setIsEditMode(false);
      setShowForm(false);
      handleFetch();
    }
  };

  const handleEdit = (details) => {
    setTaskDetails({
      taskId:details.taskId,
        title: details.title,
        description:details.description,
        assignedTo:details.assignedTo,
        deadline: details.deadline,
    });
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const res = await fetch(`${APP_SCRIPT_URL}?id=${id}`, {
      method: "POST",
      body: JSON.stringify({ action: "deleteTask" }),
    });
    const response = await res.json();
    if (response.status === "success") {
      alert("Task deleted successfully!");
      handleFetch();
    }
  };

  return (
    <>
      <nav className="nav">
        <button
          className="addAppointment"
          onClick={() => {
            setShowForm(true);
            setIsEditMode(false);
          }}
        >
          Add Task
        </button>
      </nav>

      <div className={`form-container ${showForm ? "show" : ""}`}>
        {showForm && (
          <div className="appointment-container">
            <h3 className="close-btn" onClick={() =>{ 
              setShowForm(false)
            setTaskDetails({
    taskId: "",
    title: "",
    description: "",
    assignedTo: "",
    deadline: "",
  })}}>
              X
            </h3>
            <input
              type="text"
              value={taskDetails.taskId}
              onChange={(e) =>
                setTaskDetails({ ...taskDetails, taskId: e.target.value })
              }
              placeholder="Task ID"
            />
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
            <input
              type="text"
              value={taskDetails.assignedTo}
              onChange={(e) =>
                setTaskDetails({ ...taskDetails, assignedTo: e.target.value })
              }
              placeholder="Assigned To"
            />
            <input
              type="text"
              value={taskDetails.deadline}
              onChange={(e) =>
                setTaskDetails({ ...taskDetails, deadline: e.target.value })
              }
              placeholder="Deadline"
            />
            <button onClick={handleAdd}>{isEditMode ? "Save" : "Add Task"}</button>
          </div>
        )}
      </div>

      <div className="tables-container">
        <table className="table-container">
          <thead>
            <tr>
              <th>TaskId</th>
              <th>Title</th>
              <th>Description</th>
              <th>AssignedTo</th>
              <th>Deadline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((element, index) => (
              <tr key={index}>
                <td>{element.taskId}</td>
                <td>{element.title}</td>
                <td>{element.description}</td>
                <td>{element.assignedTo}</td>
                <td>{element.deadline}</td>
                <td>
                  <div className="handlingEvents">
                    <h4 className="edit" onClick={() => handleEdit(element)}>
                      Edit
                    </h4>
                    <h4
                      className="reject"
                      onClick={() => handleDelete(element.taskId)}
                    >
                      Delete
                    </h4>
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
