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
      // Try registering the user
      await axios.post(`${API_URL}/register`, { username, password }, {
        headers: { "Content-Type": "application/json" },
      });
      // Registration successful → login automatically
      const res = await axios.post(`${API_URL}/login`, { username, password });
      localStorage.setItem("token", res.data.token);
      alert("Registration & Login successful!");
      navigate("/dashboard");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          // Username already exists → just login
          try {
            const res = await axios.post(`${API_URL}/login`, { username, password });
            localStorage.setItem("token", res.data.token);
            alert("Login successful!");
            navigate("/dashboard");
          } catch (loginError) {
            if (loginError.response && loginError.response.status === 401) {
              alert("Invalid password for existing username.");
            } else {
              alert("Login failed. Try again later.");
            }
          }
        } else {
          alert(error.response.data.message || "Registration failed. Try again.");
        }
      } else {
        alert("Network error. Please try again later.");
      }
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
