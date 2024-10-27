
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SearchPage from './component/SearchPage';
import CanvasEditor from './component/CanvasEditor'; // Adjust path as needed
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className="App container">
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/edit" element={<CanvasEditor />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
