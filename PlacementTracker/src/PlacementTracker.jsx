import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

 await fetch('http://localhost:5000/add', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});


  navigate('/topics');  // go to topics list
};

  return (
    <div>
      <h1>Placement Preparation Tracker</h1>
      <h2>Add Topic</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Subject:
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            style={{ margin: '5px' }}
          />
        </label>
        <br />
        <label>
          Topic:
          <input
            type="text"
            name="topic_name"
            value={formData.topic_name}
            onChange={handleChange}
            required
            style={{ margin: '5px' }}
          />
        </label>
        <br />
        <label>
          Status:
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={{ margin: '5px' }}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>
        <br />
        <label>
          Difficulty:
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            style={{ margin: '5px' }}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
        <br />
        <label>
          Notes:
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            style={{ margin: '5px' }}
          />
        </label>
        <br />
        <input type="submit" value="Add Topic" />
      </form>
    </div>
  );
}

export default PlacementTracker;
