import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/employees")
      .then(res => res.json())
      .then(data => {
        const emp = data.find(e => e._id === id);
        setEmployee(emp);
      });
  }, [id]);

  const saveChanges = async () => {
    setLoading(true);
    await fetch(`http://localhost:5000/api/employees/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee)
    });
    setLoading(false);
    alert("Changes saved");
  };

  const deleteEmployee = async () => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    await fetch(`http://localhost:5000/api/employees/${id}`, {
      method: "DELETE"
    });

    navigate("/");
  };

  if (!employee) return <p>Loading...</p>;

  return (
    <div className="card">
      <h3>{employee.name}</h3>
      <p><strong>Department:</strong> {employee.department}</p>

      {/* ================= TRAININGS ================= */}
      <h4>Trainings</h4>
      {employee.trainings.map((t, i) => (
        <div key={i} style={{ marginBottom: "10px" }}>
          <strong>{t.name}</strong>

          <select
            value={t.status}
            onChange={e => {
              const copy = { ...employee };
              copy.trainings[i].status = e.target.value;
              setEmployee(copy);
            }}
          >
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>

          <label style={{ marginLeft: "10px" }}>
            <input
              type="checkbox"
              checked={t.mandatory}
              onChange={e => {
                const copy = { ...employee };
                copy.trainings[i].mandatory = e.target.checked;
                setEmployee(copy);
              }}
            /> Mandatory
          </label>

          <input
            type="date"
            value={t.dueDate ? t.dueDate.substring(0, 10) : ""}
            onChange={e => {
              const copy = { ...employee };
              copy.trainings[i].dueDate = e.target.value;
              setEmployee(copy);
            }}
            style={{ marginLeft: "10px" }}
          />
        </div>
      ))}

      {/* ================= CERTIFICATIONS ================= */}
      <h4>Certifications</h4>
      {employee.certifications.map((c, i) => (
        <div key={i} style={{ marginBottom: "10px" }}>
          <strong>{c.name}</strong>

          <select
            value={c.validityType}
            onChange={e => {
              const copy = { ...employee };
              copy.certifications[i].validityType = e.target.value;
              setEmployee(copy);
            }}
            style={{ marginLeft: "10px" }}
          >
            <option value="TIME_BOUND">Time-bound</option>
            <option value="LIFETIME">Lifetime</option>
          </select>

          {c.validityType === "TIME_BOUND" && (
            <input
              type="date"
              value={c.expiryDate ? c.expiryDate.substring(0, 10) : ""}
              onChange={e => {
                const copy = { ...employee };
                copy.certifications[i].expiryDate = e.target.value;
                setEmployee(copy);
              }}
              style={{ marginLeft: "10px" }}
            />
          )}
        </div>
      ))}

      {/* ================= ACTIONS ================= */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={saveChanges} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>

        <button
          onClick={deleteEmployee}
          style={{ marginLeft: "10px", background: "#c62828", color: "white" }}
        >
          Delete Employee
        </button>
      </div>
    </div>
  );
};

export default EmployeeDetails;
