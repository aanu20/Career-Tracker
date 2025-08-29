import React, { useEffect, useState } from 'react';
import { API_URL } from './config';
function TopicsTable() {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
  fetch(`${API_URL}/topics`)
    .then(res => res.json())
    .then(data => setTopics(data))
    .catch(err => {
      console.error('Failed to load topics:', err);
      setTopics([]);
    });
}, []);


  return (
    <div>
      <h2>All Topics</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Subject</th>
            <th style={thStyle}>Topic</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Difficulty</th>
            <th style={thStyle}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {topics.map(topic => (
            <tr key={topic.id}>
              <td style={tdStyle}>{topic.id}</td>
              <td style={tdStyle}>{topic.subject}</td>
              <td style={tdStyle}>{topic.topic_name}</td>
              <td style={tdStyle}>{topic.status}</td>
              <td style={tdStyle}>{topic.difficulty}</td>
              <td style={tdStyle}>{topic.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  border: '1px solid black',
  padding: '5px'
};

const tdStyle = {
  border: '1px solid black',
  padding: '5px'
};

export default TopicsTable;
