import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const OPTIONS = [
  { label: "In 7 Days", value: 7 },
  { label: "In 2 Weeks", value: 14 },
  { label: "In a Month", value: 30 },
  { label: "In 6 Months", value: 180 },
  { label: "In 12 Months", value: 365 }
];

const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const fileDate = () => {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const daysLeft = (date) => {
  const today = new Date();
  const target = new Date(date);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
};

const urgencyColor = (days) => {
  if (days <= 7) return "#c62828";
  if (days <= 30) return "#ed6c02";
  return "#2e7d32";
};

const TrainingDueList = () => {
  const [days, setDays] = useState(30);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/employees/training-due?days=${days}`)
      .then(res => res.json())
      .then(data => setItems(data));
  }, [days]);

  const exportExcel = () => {
    const worksheetData = [
      ["Employee", "Department", "Training", "Due Date", "Days Left"]
    ];

    items.forEach(i => {
      worksheetData.push([
        i.employee,
        i.department,
        i.training,
        formatDate(i.dueDate),
        daysLeft(i.dueDate)
      ]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Bold header row
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c })];
      if (cell) cell.s = { font: { bold: true } };
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Training Deadlines");

    XLSX.writeFile(
      workbook,
      `Training_Deadlines_${fileDate()}.xlsx`
    );
  };

  return (
    <div>
      <h3>Upcoming Training Deadlines</h3>

      <div style={{ marginBottom: "10px" }}>
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setDays(opt.value)}
            style={{
              marginRight: "6px",
              background: days === opt.value ? "#1976d2" : "#eee",
              color: days === opt.value ? "white" : "black"
            }}
          >
            {opt.label}
          </button>
        ))}

        <button onClick={exportExcel} style={{ marginLeft: "10px" }}>
          Export Excel
        </button>
      </div>

      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {items.length === 0 && <li>No upcoming training deadlines</li>}

        {items.map((item, index) => {
          const left = daysLeft(item.dueDate);
          return (
            <li
              key={index}
              style={{
                borderLeft: `6px solid ${urgencyColor(left)}`,
                paddingLeft: "10px",
                marginBottom: "10px"
              }}
            >
              <strong>{item.employee}</strong> ({item.department}) –{" "}
              {item.training}
              {item.mandatory && (
                <span style={{ marginLeft: "8px", color: "#c62828" }}>
                  Mandatory
                </span>
              )}
              <div style={{ color: urgencyColor(left) }}>
                Due by {formatDate(item.dueDate)} ({left} days left)
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TrainingDueList;
