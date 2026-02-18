import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddEmployee = () => {
  const navigate = useNavigate();

  /* =========================
     EMPLOYEE INFO
     ========================= */
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");

  /* =========================
     TRAINING INFO
     ========================= */
  const [trainingName, setTrainingName] = useState("");
  const [trainingStatus, setTrainingStatus] = useState("Not Started");
  const [mandatory, setMandatory] = useState(false);
  const [trainingDueDate, setTrainingDueDate] = useState("");

  /* =========================
     CERTIFICATION INFO
     ========================= */
  const [certName, setCertName] = useState("");
  const [issuedDate, setIssuedDate] = useState("");
  const [validityType, setValidityType] = useState("TIME_BOUND");
  const [expiryDate, setExpiryDate] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name,
      department,
      trainings: trainingName
        ? [
            {
              name: trainingName,
              status: trainingStatus,
              mandatory,
              dueDate: trainingDueDate || null
            }
          ]
        : [],
      certifications: certName
        ? [
            {
              name: certName,
              issuedDate,
              validityType,
              expiryDate:
                validityType === "TIME_BOUND" ? expiryDate : null
            }
          ]
        : []
    };

    try {
      await fetch("http://localhost:5000/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      navigate("/");
    } catch (err) {
      console.error("Failed to add employee", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card form-card">
      <h3>Add Employee</h3>

      <form onSubmit={handleSubmit} className="form-grid">
        {/* ================= EMPLOYEE ================= */}
        <div className="form-group">
          <label>Employee Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Department</label>
          <input
            type="text"
            value={department}
            onChange={e => setDepartment(e.target.value)}
            required
          />
        </div>

        {/* ================= TRAINING ================= */}
        <div className="form-group">
          <label>Training Name</label>
          <input
            type="text"
            placeholder="Optional"
            value={trainingName}
            onChange={e => setTrainingName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Training Status</label>
          <select
            value={trainingStatus}
            onChange={e => setTrainingStatus(e.target.value)}
          >
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={mandatory}
              onChange={e => setMandatory(e.target.checked)}
            />{" "}
            Mandatory Training
          </label>
        </div>

        <div className="form-group">
          <label>Training Due Date</label>
          <input
            type="date"
            value={trainingDueDate}
            onChange={e => setTrainingDueDate(e.target.value)}
          />
        </div>

        {/* ================= CERTIFICATION ================= */}
        <div className="form-group">
          <label>Certification Name</label>
          <input
            type="text"
            placeholder="Optional"
            value={certName}
            onChange={e => setCertName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Certification Validity</label>
          <select
            value={validityType}
            onChange={e => setValidityType(e.target.value)}
          >
            <option value="TIME_BOUND">Time-bound</option>
            <option value="LIFETIME">Lifetime</option>
          </select>
        </div>

        <div className="form-group">
          <label>Issued Date</label>
          <input
            type="date"
            value={issuedDate}
            onChange={e => setIssuedDate(e.target.value)}
            required={!!certName}
          />
        </div>

        {validityType === "TIME_BOUND" && certName && (
          <div className="form-group">
            <label>Expiry Date</label>
            <input
              type="date"
              value={expiryDate}
              onChange={e => setExpiryDate(e.target.value)}
              required
            />
          </div>
        )}

        {/* ================= ACTION ================= */}
        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Add Employee"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
