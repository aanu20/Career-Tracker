import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PlacementTracker from './PlacementTracker.jsx';
import TopicsTable from './TopicsTable.jsx';
import Register from "./Register.jsx";
import Login from "./Login.jsx";
import Dashboard from './Dashboard.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/topics" element={<TopicsTable />} /> */}
        <Route path="/add-topic" element={<PlacementTracker />} />
        <Route path='/dashboard' element={< Dashboard/>}/>
      </Routes>
    </Router>
  );
}

export default App;
