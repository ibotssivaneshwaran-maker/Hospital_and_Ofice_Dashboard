import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const FETCH_URL =
    "https://script.google.com/macros/s/AKfycbz0OLVtXQmky-l57zhLc9aCk02t1vS5TB9pzORL-fVNvnVoBKeZe5MnaKry2FAmoQUy/exec";

  const handleClick = async () => {
    try {
      const data = {
        name: input,
        password: password,
        action: "Admin",
      };
      const res = await fetch(FETCH_URL, {
        method: "POST",
        body: JSON.stringify(data),
      });

      const text = await res.text();
      const response = JSON.parse(text);

      if (response.status === "success") {
        navigate(`/${data.action}/dashboard`);
      } else {
        alert("Invalid username or password");
      }
    } catch (err) {
      console.error("Error fetching:", err);
      alert("Failed to login. Check console for details.");
    }
  };

  return (
    <>
      <h1>Admin Login</h1>
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

        <button onClick={handleClick}>Login</button>
      </div>
    </>
  );
};

export default AdminLogin;
