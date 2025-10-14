import React, { useEffect, useState } from 'react'

const InternDashboard = () => {

    const [task, setTask] = useState([]);
    const [isEditMode, setEditMode] = useState(false)
    const [taskDetails, setTaskDetails] = useState({
      taskId: "",
      title: "",
      description: "",
      assignedTo: "",
      deadline: "",
      action:"addTask",
    });
  
    const APP_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbz0OLVtXQmky-l57zhLc9aCk02t1vS5TB9pzORL-fVNvnVoBKeZe5MnaKry2FAmoQUy/exec";
  

       const handleAdd = async () => {
    console.log("handleAdd called")
    const response = await fetch(APP_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(taskDetails),
    });
    const res = await response.json();
    console.log(res.status)
    if (res.status === "success") {
      setTaskDetails({
    taskId: "",
    title: "",
    description: "",
    assignedTo: "",
    deadline: ""
  })
      handleFetch()
      setEditMode(false)
    }
  }


   const handleFetch = async() => {
      console.log("called")
      const response = await fetch(`${APP_SCRIPT_URL}?action=getTasks`,{
        method:"GET"
      })
      const res =await response.json()
      console.log(res.res)
      if(res.status === "success"){
        setTask(res.res)
      }
    }
    useEffect(() => {
      handleFetch()
    },[])

     const handleEdit = (details) => {
    setTaskDetails({
      taskId:details.taskId,
    title:details.title,
    description:details.description ,
    assignedTo:details.assignedTo,
    deadline:details.deadline,
    action:"editTask"
    })
    setEditMode(true)
  }
  const handleCancel = () => {
    setEditMode(false)
  }
  return (
     <>
     {isEditMode ? (<div>
         <input
          type="text"
          value={taskDetails.taskId}
          onChange={(e) =>
            setTaskDetails({ ...taskDetails, taskId: e.target.value })
          }
        />
        <input
          type="text"
          value={taskDetails.title}
          onChange={(e) =>
            setTaskDetails({ ...taskDetails, title: e.target.value })
          }
        />
        <textarea
          name=""
          id=""
          value={taskDetails.description}
          onChange={(e) =>
            setTaskDetails({ ...taskDetails, description: e.target.value })
          }
        ></textarea>
        <input
          type="text"
          value={taskDetails.assignedTo}
          onChange={(e) =>
            setTaskDetails({ ...taskDetails, assignedTo: e.target.value })
          }
        />
        <input
          type="text"
          value={taskDetails.deadline}
          onChange={(e) =>
            setTaskDetails({ ...taskDetails, deadline: e.target.value })
          }
        />
        <button onClick={handleAdd} >{isEditMode ? "Save": "Add Task"}</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>):null}
      <table>
        <thead>
          <tr>
            <th>TaskId</th>
            <th>Title</th>
            <th>Description</th>
            <th>AssignedTo</th>
            <th>Deadline</th>
          </tr>
        </thead>
        <tbody>
          {task.map((element,index) => (
            <tr key={index+1}>
              <td>{element.taskId}</td>
              <td>{element.title}</td>
              <td>{element.description}</td>
              <td>{element.assignedTo}</td>
              <td>{element.deadline}</td>
              <td><button onClick={() => handleEdit(element)}>Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default InternDashboard