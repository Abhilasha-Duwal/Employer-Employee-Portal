import React, { useState } from "react";
import "./CSS/LoginSignup.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { uploadEmployees } from "../redux/EmployeeSlice";
import uploadImage from "../assets/images/upload.png";

const AddMultipleEmployee = () => {
  const [file, setFile] = useState(null);
  const { error } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!file) {
        throw new Error("Please select a file.");
      }

      // Dispatch action to create employer with form data from Redux store
      const resultAction = await dispatch(uploadEmployees(file));
      if (uploadEmployees.fulfilled.match(resultAction)) {
        // Reset file input after successful upload
        setFile(null);
        navigate("/employer-dashboard");
      } else {
        console.error("Failed to upload employees:", resultAction.payload);
      }
    } catch (error) {
      console.error("Error adding file:", error);
    }
  };

  return (
    <div className="loginsignup container">
      <form className="loginsignup-container" onSubmit={handleSubmit}>
        <h1>Add File to create multiple employees</h1>
        <div className="file-upload">
          <label htmlFor="fileInput">Please Upload excel file</label>
          <input
            type="file"
            id="fileInput"
            name="excelFile"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <div type="submit" onClick={handleSubmit} className="upload-image">
            <img src={uploadImage} alt="Upload" />
          </div>
        </div>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default AddMultipleEmployee;
