const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
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
      default: "admin",
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("admin", userSchema);

module.exports = Admin;
