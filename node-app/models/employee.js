const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
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
    mobile: {
      type: String,
      required: false,
      unique: true,
    },
    annualSalary: {
      type: Number,
      required: false,
    },
    jobTitle: {
      type: String,
      required: false,
    },
    userRole: {
      type: String,
      required: true,
      default: "employee",
    },
  },
  { timestamps: true }
);

// Compound index to ensure uniqueness across email and mobile
employeeSchema.index({ email: 1, mobile: 1 });

const Employee = mongoose.model("employee", employeeSchema);

module.exports = Employee;
