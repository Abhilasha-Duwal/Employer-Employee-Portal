const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    annualSalary: {
      type: Number,
      required: true,
    },
    jobTitle: {
      type: String,
      default: "Hiring Manager",
    },
    userRole: {
      type: String,
      default: "employer",
    },
  },
  { timestamps: true }
);

const Employer = mongoose.model("employer", employerSchema);

module.exports = Employer;
