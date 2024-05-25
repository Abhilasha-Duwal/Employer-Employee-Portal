import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOwnDetail, EditEmployeeItself } from "../redux/EmployeeSlice";
import getCurrentUser from "../utility/getUser";
import {
  setUsername,
  setEmail,
  setPassword,
  setAddress,
  setMobile,
  setAnnualSalary,
  setJobTitle,
  resetForm,
} from "../redux/FormSlice";
import { useNavigate } from "react-router-dom";

const EditDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { username, email, password, address, mobile } = useSelector(
    (state) => state.form
  ); // Select the form data from the Redux store

  const userId = getCurrentUser()._id;

  useEffect(() => {
    dispatch(fetchOwnDetail(userId))
      .then((result) => {
        console.log("Your details fetched successfully:", result);
        // Set form data with fetched employee details
        dispatch(setUsername(result.payload.username));
        dispatch(setEmail(result.payload.email));
        dispatch(setPassword(result.payload.password));
        dispatch(setAddress(result.payload.address));
        dispatch(setMobile(result.payload.mobile));
        dispatch(setAnnualSalary(result.payload.annualSalary));
        dispatch(setJobTitle(result.payload.jobTitle));
      })
      .catch((error) => {
        console.error("Error fetching your details:", error);
      });
  }, [dispatch, userId]);
  console.log("formname", username);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting formData:", { username, email, password, address, mobile });
      // Dispatch action to create employer with form data from Redux store
      await dispatch(EditEmployeeItself({ userId, updatedData: { username, email, password, address, mobile } }));
      // Reset form fields after successful registration
      dispatch(resetForm()); // Reset form fields
      navigate("/employee-dashboard");
    } catch (error) {
      console.log("Registration error:", error);
    }
  };

  return (
    <div className="edit-form container">
      <h2>Edit Your Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            defaultValue={username}
            onChange={(e) => dispatch(setUsername(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue={email}
            onChange={(e) => dispatch(setEmail(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            defaultValue={password}
            onChange={(e) => dispatch(setPassword(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            defaultValue={address}
            onChange={(e) => dispatch(setAddress(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label htmlFor="mobile">Mobile Number</label>
          <input
            type="text"
            id="mobile"
            name="mobile"
            defaultValue={mobile}
            onChange={(e) => dispatch(setMobile(e.target.value))}
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditDetails;
