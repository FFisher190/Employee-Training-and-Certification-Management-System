const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");

/* ================= ADD EMPLOYEE ================= */
router.post("/", async (req, res) => {
  try {
    const emp = new Employee(req.body);
    res.json(await emp.save());
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ================= GET ALL EMPLOYEES ================= */
router.get("/", async (req, res) => {
  res.json(await Employee.find());
});

/* ================= UPDATE EMPLOYEE ================= */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ================= DELETE EMPLOYEE ================= */
router.delete("/:id", async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.json({ message: "Employee deleted" });
});

/* ================= CERTIFICATION EXPIRY ================= */
router.get("/expiring", async (req, res) => {
  const days = Number(req.query.days) || 30;
  const today = new Date();
  const future = new Date();
  future.setDate(today.getDate() + days);

  const employees = await Employee.find();
  const out = [];

  employees.forEach(e => {
    e.certifications.forEach(c => {
      if (
        c.validityType === "TIME_BOUND" &&
        c.expiryDate &&
        c.expiryDate >= today &&
        c.expiryDate <= future
      ) {
        out.push({
          employee: e.name,
          department: e.department,
          certification: c.name,
          expiryDate: c.expiryDate
        });
      }
    });
  });

  res.json(out);
});

/* ================= TRAINING DUE ================= */
router.get("/training-due", async (req, res) => {
  const days = Number(req.query.days) || 30;
  const today = new Date();
  const future = new Date();
  future.setDate(today.getDate() + days);

  const employees = await Employee.find();
  const out = [];

  employees.forEach(e => {
    e.trainings.forEach(t => {
      if (
        t.dueDate &&
        t.status !== "Completed" &&
        t.dueDate >= today &&
        t.dueDate <= future
      ) {
        out.push({
          employee: e.name,
          department: e.department,
          training: t.name,
          mandatory: t.mandatory,
          dueDate: t.dueDate
        });
      }
    });
  });

  res.json(out);
});

/* ================= ADD SUGGESTION ================= */
router.post("/:id/suggestions", async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    emp.suggestions.push({ message: req.body.message });
    await emp.save();
    res.json({ message: "Suggestion submitted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ================= GET ALL SUGGESTIONS ================= */
router.get("/suggestions/all", async (req, res) => {
  const employees = await Employee.find();
  const suggestions = [];

  employees.forEach(emp => {
    emp.suggestions.forEach(s => {
      suggestions.push({
        employee: emp.name,
        department: emp.department,
        message: s.message,
        date: s.createdAt
      });
    });
  });

  res.json(suggestions);
});

module.exports = router;
