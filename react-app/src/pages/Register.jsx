import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./CSS/LoginSignup.css";
import getCurrentUser from "../utility/getUser";
import { createEmployer } from "../redux/EmployerSlice";
import { createEmployee } from "../redux/EmployeeSlice";
import {
  setUsername,
  setEmail,
  setPassword,
  setAddress,
  setAnnualSalary,
  setJobTitle,
  setUserRole,
  resetForm,
} from "../redux/FormSlice";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.form); // Select the form data from the Redux store

  const CURRENT_USER = getCurrentUser();

  // Determine which action to dispatch based on user role
  const createUserAction = (data) => {
    return CURRENT_USER?.userRole === "admin"
      ? createEmployer(data)
      : createEmployee(data);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Dispatch action to create employer with form data from Redux store
      await dispatch(createUserAction(formData));
      // Reset form fields after successful registration
      dispatch(resetForm()); // Reset form fields
      navigate(
        CURRENT_USER?.userRole === "admin" ? "/" : "/employer-dashboard"
      );
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="loginsignup container">
      <div className="loginsignup-container">
        <h1>
          Register{" "}
          {CURRENT_USER?.userRole === "admin" ? "Employer" : "Employee"}
        </h1>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="register-fields-wrapper">
            <div className="register-field">
              <label htmlFor="username">User name</label>
              <input
                type="text"
                placeholder="Employer's Name"
                name="username"
                value={formData.username}
                onChange={(e) => dispatch(setUsername(e.target.value))}
              />
            </div>
            <div className="register-field">
              <label htmlFor="username">Email</label>
              <input
                type="email"
                placeholder="Email Address"
                name="email"
                value={formData.email}
                onChange={(e) => dispatch(setEmail(e.target.value))}
              />
            </div>
            <div className="register-field">
              <label htmlFor="username">Password</label>
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={(e) => dispatch(setPassword(e.target.value))}
              />
            </div>
            <div className="register-field">
              <label htmlFor="username">Address</label>
              <input
                type="text"
                placeholder="Address"
                name="address"
                value={formData.address}
                onChange={(e) => dispatch(setAddress(e.target.value))}
              />
            </div>
            <div className="register-field">
              <label htmlFor="username">Annual Salary</label>
              <input
                type="number"
                placeholder="Annual Salary"
                name="annualSalary"
                value={formData.annualSalary}
                onChange={(e) => dispatch(setAnnualSalary(e.target.value))}
              />
            </div>
            <div className="register-field">
              <label htmlFor="username">Job Title</label>
              <input
                type="text"
                placeholder="Job Title"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => dispatch(setJobTitle(e.target.value))}
              />
            </div>
            <div className="register-field">
              <label htmlFor="username">User Role</label>
              <input
                type="text"
                placeholder="User Role"
                name="userRole"
                value={formData.userRole}
                onChange={(e) => dispatch(setUserRole(e.target.value))}
              />
            </div>
          </div>
          <button type="submit">ADD USER</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
