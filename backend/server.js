const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Training & Certification Tracker API");
});

// database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
const employeeRoutes = require("./routes/employees");

app.use("/api/employees", employeeRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
