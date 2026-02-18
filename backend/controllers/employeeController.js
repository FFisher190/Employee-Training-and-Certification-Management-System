
const Employee = require("../models/Employee");

// Add new employee
exports.addEmployee = async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get expiring certifications
exports.getExpiringCertifications = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    const employees = await Employee.find({
      "certifications.expiryDate": {
        $gte: today,
        $lte: futureDate
      }
    });

    const expiring = [];

    employees.forEach(emp => {
      emp.certifications.forEach(cert => {
        if (
  cert.validityType === "TIME_BOUND" &&
  cert.expiryDate &&
  cert.expiryDate >= today &&
  cert.expiryDate <= futureDate
) {
  expiring.push({
    employee: emp.name,
    department: emp.department,
    certification: cert.name,
    expiryDate: cert.expiryDate
  });
}
      });
    });

    res.json(expiring);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

