import React, { useEffect, useState } from "react";

const InternDashboard = () => {
  const [task, setTask] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [taskDetails, setTaskDetails] = useState({
    taskId: "",
    title: "",
    description: "",
    assignedTo: "",
    deadline: "",
    action: "addTask",
  });

  const APP_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbz0OLVtXQmky-l57zhLc9aCk02t1vS5TB9pzORL-fVNvnVoBKeZe5MnaKry2FAmoQUy/exec";

  // Fetch all tasks
  const handleFetch = async () => {
    const response = await fetch(`${APP_SCRIPT_URL}?action=getTasks`);
    const res = await response.json();
    if (res.status === "success") {
      setTask(res.res);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  // Add or Edit Task
  const handleAdd = async () => {
    const response = await fetch(APP_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskDetails),
    });
    const res = await response.json();

    if (res.status === "success") {
      alert(isEditMode ? "Task Updated Successfully!" : "Task Added Successfully!");
      setTaskDetails({
        taskId: "",
        title: "",
        description: "",
        assignedTo: "",
        deadline: "",
        action: "addTask",
      });
      setEditMode(false);
      setIsFormVisible(false);
      handleFetch();
    }
  };

  // Open edit form with details
  const handleEdit = (details) => {
    setTaskDetails({
      taskId: details.taskId,
      title: details.title,
      description: details.description,
      assignedTo: details.assignedTo,
      deadline: details.deadline,
      action: "editTask",
    });
    setEditMode(true);
    setIsFormVisible(true);
  };

  // Cancel form
  const handleCancel = () => {
    setEditMode(false);
    setIsFormVisible(false);
    setTaskDetails({
      taskId: "",
      title: "",
      description: "",
      assignedTo: "",
      deadline: "",
      action: "addTask",
    });
  };

  return (
    <>
      <h1 className="dashboard-title">Intern Dashboard</h1>

      <nav className="nav">
        <button
          className="addAppointment"
          onClick={() => {
            setIsFormVisible(true);
            setEditMode(false);
            setTaskDetails({
              taskId: "",
              title: "",
              description: "",
              assignedTo: "",
              deadline: "",
              action: "addTask",
            });
          }}
        >
          Add Task
        </button>
      </nav>

      <div className={`form-container ${isFormVisible ? "show" : ""}`}>
        {isFormVisible && (
          <div className="appointment-container">
            <h3 className="close-btn" onClick={handleCancel}>X</h3>
            <input
              type="text"
              placeholder="Task ID"
              value={taskDetails.taskId}
              onChange={(e) =>
                setTaskDetails({ ...taskDetails, taskId: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Title"
              value={taskDetails.title}
              onChange={(e) =>
                setTaskDetails({ ...taskDetails, title: e.target.value })
              }
            />
            <textarea
              placeholder="Description"
              value={taskDetails.description}
              onChange={(e) =>
                setTaskDetails({ ...taskDetails, description: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Assigned To"
              value={taskDetails.assignedTo}
              onChange={(e) =>
                setTaskDetails({ ...taskDetails, assignedTo: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Deadline"
              value={taskDetails.deadline}
              onChange={(e) =>
                setTaskDetails({ ...taskDetails, deadline: e.target.value })
              }
            />
            <button onClick={handleAdd}>
              {isEditMode ? "Save Changes" : "Add Task"}
            </button>
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
            {task.map((element, index) => (
              <tr key={index + 1}>
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

export default InternDashboard;
