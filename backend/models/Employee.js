const mongoose = require("mongoose");

/* ================= TRAINING ================= */
const TrainingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
    default: "Not Started"
  },
  mandatory: { type: Boolean, default: false },
  dueDate: { type: Date }
});

/* ================= CERTIFICATION ================= */
const CertificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuedDate: { type: Date, required: true },
  validityType: {
    type: String,
    enum: ["LIFETIME", "TIME_BOUND"],
    required: true
  },
  expiryDate: { type: Date },
  linkedTraining: { type: String }
});

/* ================= SUGGESTION ================= */
const SuggestionSchema = new mongoose.Schema({
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

/* ================= EMPLOYEE ================= */
const EmployeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    department: { type: String, required: true },
    trainings: [TrainingSchema],
    certifications: [CertificationSchema],
    suggestions: [SuggestionSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", EmployeeSchema);


