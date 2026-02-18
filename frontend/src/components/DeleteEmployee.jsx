import React, { useState } from "react";

const DeleteEmployee = ({ employees, onDelete }) => {
  const [selectedId, setSelectedId] = useState("");

  const handleDelete = async () => {
    if (!selectedId) return;

    const confirm = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (!confirm) return;

    await fetch(
      `http://localhost:5000/api/employees/${selectedId}`,
      { method: "DELETE" }
    );

    setSelectedId("");
    onDelete();
  };

  return (
    <div>
      <h3>Delete Employee</h3>

      <select
        value={selectedId}
        onChange={e => setSelectedId(e.target.value)}
      >
        <option value="">Select employee</option>
        {employees.map(emp => (
          <option key={emp._id} value={emp._id}>
            {emp.name} ({emp.department})
          </option>
        ))}
      </select>

      <button
        onClick={handleDelete}
        disabled={!selectedId}
        style={{ marginLeft: "10px", background: "#7b7c7ea8" }}
      >
        Delete
      </button>
    </div>
  );
};

export default DeleteEmployee;
