import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const OfficeRoleLogin = ({ role }) => {
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const FETCH_URL =
    "https://script.google.com/macros/s/AKfycbz0OLVtXQmky-l57zhLc9aCk02t1vS5TB9pzORL-fVNvnVoBKeZe5MnaKry2FAmoQUy/exec";

  const handleLogin = async () => {
    if (!input || !password) {
      alert("Please fill in both fields.");
      return;
    }

    try {
      const data = { name: input, password, action: role };
      const res = await fetch(FETCH_URL, {
        method: "POST",
        body: JSON.stringify(data),
      });
      const response = await res.json();

      if (response.status === "success") {
        localStorage.setItem("role", data.action);
        localStorage.setItem("isAuthenticated", true);
        localStorage.setItem("name", input);
        navigate(`/${data.action}/dashboard`);
      } else {
        alert("Invalid username or password");
      }
    } catch (err) {
      console.error("Error fetching:", err);
      alert("Login failed. Try again later.");
    }
  };

  return (
    <>
      <h1>{role === "officeadmin" ? "Admin Login" : "Intern Login"}</h1>
      <div className="login-container">
        <label htmlFor="name">UserName</label>
        <input
          type="text"
          id="name"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>
      </div>
    </>
  );
};

export default OfficeRoleLogin;
