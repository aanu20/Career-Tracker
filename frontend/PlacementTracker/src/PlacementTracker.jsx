import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./styles.css";
import Dashboard from './Dashboard';
import { API_URL } from './config';
function PlacementTracker() {
  const [formData, setFormData] = useState({
    subject: '',
    topic_name: '',
    status: 'pending',
    difficulty: 'easy',
    notes: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // include JWT token

    await fetch(`${API_URL}/add`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    navigate('/dashboard');  // go to topics list
  };
 

  return (
    <div className="placement-container">
      <h1>Placement Preparation Tracker</h1>
      <h2>Add Topic</h2>
      <form onSubmit={handleSubmit} className="placement-form">
        <label>
          Subject:
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Topic:
          <input
            type="text"
            name="topic_name"
            value={formData.topic_name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Status:
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>

        <label>
          Difficulty:
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>

        <label>
          Notes:
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
        </label>

        <input type="submit" value="Add Topic" />
      </form>
    </div>
  );
}

export default PlacementTracker;
