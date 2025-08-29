import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { API_URL } from "./config";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Please fill all fields");
      return;
    }
    try {
          await axios.post(
      `${API_URL}/register`,
      { username, password },
      { headers: { "Content-Type": "application/json" } }
    );

      
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      alert("Already exists.. Login .");
      navigate("/login");
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
