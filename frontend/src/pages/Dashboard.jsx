import React, { useEffect, useState } from "react";
import { getEmployees } from "../services/api";
import ExpiryList from "../components/ExpiryList";
import TrainingDueList from "../components/TrainingDueList";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [expiringCertCount, setExpiringCertCount] = useState(0);

  const refreshEmployees = () => {
    getEmployees().then(data => setEmployees(data));
  };

  useEffect(() => {
    refreshEmployees();
    fetch("http://localhost:5000/api/employees/expiring?days=30")
      .then(res => res.json())
      .then(data => setExpiringCertCount(data.length));
  }, []);

  const departments = [
    "All",
    ...new Set(employees.map(emp => emp.department))
  ];

  const filteredEmployees = employees.filter(emp => {
    const matchesName =
      emp.name.toLowerCase().includes(search.toLowerCase());
    const matchesDept =
      department === "All" || emp.department === department;
    return matchesName && matchesDept;
  });

  const totalTrainings = employees.reduce(
    (sum, e) => sum + e.trainings.length,
    0
  );

  const pendingMandatory = employees.reduce((count, e) => {
    return (
      count +
      e.trainings.filter(
        t => t.mandatory && t.status !== "Completed"
      ).length
    );
  }, 0);

  const totalCertifications = employees.reduce(
    (sum, e) => sum + e.certifications.length,
    0
  );

  return (
    <>
      {/* ===== STATS ===== */}
      <div className="card stat-row">
        <div className="stat">
          <h3>{employees.length}</h3>
          <p>Employees</p>
        </div>
        <div className="stat">
          <h3>{totalTrainings}</h3>
          <p>Total Trainings</p>
        </div>
        <div className="stat">
          <h3>{pendingMandatory}</h3>
          <p>Pending Mandatory Trainings</p>
        </div>
        <div className="stat">
          <h3>{totalCertifications}</h3>
          <p>Total Certifications</p>
        </div>
        <div className="stat">
          <h3>{expiringCertCount}</h3>
          <p>Expiring Certifications</p>
        </div>
      </div>

      {/* ===== QUICK ACTION ===== */}
      <div className="card">
        <Link to="/suggestions">
          <button>View Employee Suggestions</button>
        </Link>
      </div>

      {/* ===== TABLE ===== */}
      <div className="card">
        <div className="controls">
          <input
            placeholder="Search employee"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <select
            value={department}
            onChange={e => setDepartment(e.target.value)}
          >
            {departments.map(dep => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </select>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Trainings</th>
              <th>Certifications</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map(emp => (
              <tr key={emp._id}>
                <td>
                  <Link to={`/employee/${emp._id}`}>
                    {emp.name}
                  </Link>
                </td>
                <td>{emp.department}</td>
                <td>{emp.trainings.length}</td>
                <td>{emp.certifications.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <TrainingDueList />
      </div>

      <div className="card">
        <ExpiryList />
      </div>
    </>
  );
};

export default Dashboard;
