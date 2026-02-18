import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Suggestions = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/employees/suggestions/all")
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  return (
    <div className="card">
      <h3>Employee Suggestions</h3>

      {items.length === 0 && <p>No suggestions submitted yet.</p>}

      <ul style={{ paddingLeft: "0", listStyle: "none" }}>
        {items.map((s, i) => (
          <li
            key={i}
            style={{
              borderBottom: "1px solid #ddd",
              padding: "10px 0"
            }}
          >
            <strong>{s.employee}</strong> ({s.department})
            <p style={{ margin: "6px 0" }}>{s.message}</p>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {new Date(s.date).toDateString()}
            </div>
          </li>
        ))}
      </ul>

      <Link to="/" style={{ display: "inline-block", marginTop: "10px" }}>
        ← Back to Dashboard
      </Link>
    </div>
  );
};

export default Suggestions;
