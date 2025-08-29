import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import "./styles.css";
import { API_URL } from "./config";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const navigate = useNavigate();
  const [topicsData, setTopicsData] = useState(null);

  useEffect(() => {
    const fetchTopics = async () => {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login first!");

      try {
        const res = await axios.get(`${API_URL}/user/topics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTopicsData(res.data);
      } catch (error) {
        alert("Failed to fetch topics");
      }
    };
    fetchTopics();
  }, []);

  if (!topicsData) return <p style={{ textAlign: "center" }}>Loading...</p>;

  // Pie chart data
  const data = {
    labels: ["Pending", "In Progress", "Completed"],
    datasets: [
      {
        label: "Topic Status",
        data: [
          topicsData.pending,
          topicsData.total_topics - topicsData.completed - topicsData.pending,
          topicsData.completed,
        ],
        backgroundColor: ["#f39c12", "#3498db", "#2ecc71"],
        borderColor: ["#e67e22", "#2980b9", "#27ae60"],
        borderWidth: 1,
      },
    ],
  };

  // Inside Dashboard component
const add = () => {
  navigate("/add-topic")
};


  return (
    <div className="dashboard-container">
      <h2>Welcome to Your Placement Tracker Dashboard</h2>
      <button className="add-button" onClick={add}>Add Topics</button>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <h3>Total Topics</h3>
          <p>{topicsData.total_topics}</p>
        </div>
        <div className="card">
          <h3>Completed</h3>
          <p>{topicsData.completed}</p>
        </div>
        <div className="card">
          <h3>Pending</h3>
          <p>{topicsData.pending}</p>
        </div>
      </div>

    <div className="table-pie-container">
        {/* Topics Table */}
        <table className="topics-table">
        <thead>
            <tr>
            <th>Subject</th>
            <th>Topic</th>
            <th>Status</th>
            <th>Difficulty</th>
            </tr>
        </thead>
        <tbody>
            {topicsData.topics.map((topic, index) => (
            <tr key={index}>
                <td>{topic.subject}</td>
                <td>{topic.topic}</td>
                <td>
                <span className={`status status-${topic.status.replace(" ", "-")}`}>
                    {topic.status}
                </span>
                </td>
                <td>{topic.difficulty}</td>
            </tr>
            ))}
        </tbody>
        </table>

        {/* Pie Chart */}
        <div className="pie-container">
        <Pie data={data} />
        </div>
        </div>

    </div>
  );
}

export default Dashboard;
