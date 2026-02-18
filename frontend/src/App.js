import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import AddEmployee from "./pages/AddEmployee";
import EmployeeDetails from "./pages/EmployeeDetails";
import UserDashboard from "./pages/UserDashboard";
import Suggestions from "./pages/Suggestions";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <div className="header">
          <h2>Training & Certification Tracker</h2>
          <p>Internal HR dashboard</p>

          <div style={{ marginTop: "10px" }}>
            <Link to="/" style={{ marginRight: "12px" }}>
              Admin Dashboard
            </Link>
            <Link to="/add" style={{ marginRight: "12px" }}>
              Add Employee
            </Link>
            <Link to="/user" style={{ marginRight: "12px" }}>
              Employee View
            </Link>
            <Link to="/suggestions">
              View Suggestions
            </Link>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddEmployee />} />
          <Route path="/employee/:id" element={<EmployeeDetails />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/suggestions" element={<Suggestions />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
