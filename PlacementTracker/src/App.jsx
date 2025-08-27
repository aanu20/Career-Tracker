import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PlacementTracker from './PlacementTracker.jsx';
import TopicsTable from './TopicsTable.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PlacementTracker />} />
        <Route path="/topics" element={<TopicsTable />} />
        <Route path="/add-topic" element={<PlacementTracker />} />
      </Routes>
    </Router>
  );
}

export default App;
