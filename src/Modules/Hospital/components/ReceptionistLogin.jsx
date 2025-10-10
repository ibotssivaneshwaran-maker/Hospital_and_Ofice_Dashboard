import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const ReceptionistLogin = () => {
   const [input, setInput] = useState("");
      const [password, setPassword] = useState("");
      const navigate = useNavigate();
    
      const FETCH_URL =
        "https://script.google.com/macros/s/AKfycbyxnrwdz-AEoDY6IYeyiOWnlw0Zb7dcapMvDAHmf3OeCw9loYELF_BsPdYPP2T8pCO7/exec";
    
      const handleClick = async () => {
        try {
          const formData = new URLSearchParams();
          formData.append("action", "Staff");
          formData.append("name", input);
          formData.append("password", password);
    
          const res = await fetch(FETCH_URL, {
            method: "POST",
            body: formData,
          });
    
          const text = await res.text();
          const response = JSON.parse(text);
    
          if (response.status === "success") {
            navigate(`/${formData.get("action")}/dashboard`); 
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
      <h1>Receptionist/Staff Login</h1>
      <div className="login-container">
        <label htmlFor="name">UserName</label>
        <input type="text"id="name"
        value={input}
        onChange={(e) => setInput(e.target.value)} />
        <label htmlFor="password">Password</label>
        <input type="password" id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleClick}>Login</button>
      </div>
    </>
  )
}

export default ReceptionistLogin