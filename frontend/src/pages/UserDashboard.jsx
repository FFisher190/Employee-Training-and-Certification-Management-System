import React, { useEffect, useState } from "react";

const UserDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [suggestion, setSuggestion] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/employees")
      .then(res => res.json())
      .then(data => {
        setEmployees(data);
        if (data.length > 0) setEmployee(data[0]);
      });
  }, []);

  const submitSuggestion = async () => {
    if (!suggestion.trim() || !employee) return;

    await fetch(
      `http://localhost:5000/api/employees/${employee._id}/suggestions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: suggestion })
      }
    );

    setSuggestion("");
    setStatus("Suggestion submitted successfully!");
  };

  if (!employee) return <p>Loading...</p>;

  return (
    <div className="card">
      <h3>Employee View</h3>

      {/* ===== EMPLOYEE SELECTOR ===== */}
      <label>
        Select Employee (Demo Login):
        <select
          value={employee._id}
          onChange={e => {
            const selected = employees.find(
              emp => emp._id === e.target.value
            );
            setEmployee(selected);
            setStatus("");
          }}
          style={{ marginLeft: "10px" }}
        >
          {employees.map(emp => (
            <option key={emp._id} value={emp._id}>
              {emp.name}
            </option>
          ))}
        </select>
      </label>

      <hr />

      <h4>Welcome, {employee.name}</h4>
      <p><strong>Department:</strong> {employee.department}</p>

      {/* ===== TRAININGS ===== */}
      <h4>Your Trainings</h4>
      {employee.trainings.length === 0 && <p>No trainings assigned</p>}
      <ul>
        {employee.trainings.map((t, i) => (
          <li key={i}>
            <strong>{t.name}</strong>
            <div>Status: {t.status}</div>
            {t.dueDate && (
              <div>
                Due by: {new Date(t.dueDate).toDateString()}
              </div>
            )}
            {t.mandatory && (
              <div style={{ color: "#c62828" }}>Mandatory</div>
            )}
          </li>
        ))}
      </ul>

      {/* ===== CERTIFICATIONS (IMPROVED) ===== */}
      <h4>Your Certifications</h4>
      {employee.certifications.length === 0 && (
        <p>No certifications</p>
      )}

      <ul>
        {employee.certifications.map((c, i) => (
          <li key={i}>
            <strong>{c.name}</strong>

            <div>
              Issued on:{" "}
              {c.issuedDate
                ? new Date(c.issuedDate).toDateString()
                : "N/A"}
            </div>

            <div>
              Validity:{" "}
              {c.validityType === "LIFETIME"
                ? "Lifetime"
                : "Time-bound"}
            </div>

            {c.validityType === "TIME_BOUND" && c.expiryDate && (
              <div style={{ color: "#c62828" }}>
                Expires on:{" "}
                {new Date(c.expiryDate).toDateString()}
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* ===== SUGGESTION BOX ===== */}
      <h4>Suggestion Box</h4>
      <textarea
        rows="4"
        value={suggestion}
        onChange={e => setSuggestion(e.target.value)}
        placeholder="Share your suggestions or feedback..."
        style={{ width: "100%" }}
      />
      <button onClick={submitSuggestion} style={{ marginTop: "8px" }}>
        Submit
      </button>

      {status && <p style={{ color: "green" }}>{status}</p>}
    </div>
  );
};

export default UserDashboard;
