import React, { useEffect, useState } from "react";

const SuggestionList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/employees/suggestions/all")
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  return (
    <div>
      <h3>Employee Suggestions</h3>

      {items.length === 0 && <p>No suggestions yet</p>}

      <ul>
        {items.map((s, i) => (
          <li key={i}>
            <strong>{s.employee}</strong> ({s.department})<br />
            {s.message}
            <div style={{ fontSize: "12px", color: "#666" }}>
              {new Date(s.date).toDateString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuggestionList;
