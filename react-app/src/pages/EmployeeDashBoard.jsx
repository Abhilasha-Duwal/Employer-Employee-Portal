import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./CSS/DashBoard.css";
import { fetchOwnDetail, selectEmployeeDetail } from "../redux/EmployeeSlice";
import getCurrentUser from "../utility/getUser";

const EmployeeDashBoard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const employeeSelfDetail = useSelector(selectEmployeeDetail); // Get employees state from Redux

  const userId = getCurrentUser()._id;

  useEffect(() => {
    dispatch(fetchOwnDetail(userId))
      .then((result) => {
        console.log("Your details fetched successfully:", result);
      })
      .catch((error) => {
        console.error("Error fetching your details:", error);
      });
  }, [dispatch, userId]);

  console.log("employee-dashboard", employeeSelfDetail);

  if (!employeeSelfDetail) {
    return <div className="container loading">Loading...</div>; // Show loading state while fetching details
  }

  return (
    <div className="dashboard container">
       <button className="dashboard-button" onClick={()=>navigate("/edit/me")}>Edit Your details</button>
      <p className="title">Your details</p>
      <ul className="my-employee-detail">
        <li className="detail">
          <label htmlFor="">Your User Name</label>
          <span>{employeeSelfDetail.username}</span>
        </li>
        <li className="detail">
          <label htmlFor="">Your Email</label>
          <span>{employeeSelfDetail.email}</span>
        </li>
        <li className="detail">
          <label htmlFor="">Your Password</label>
          <span>{employeeSelfDetail.password}</span>
        </li>
        <li className="detail">
          <label htmlFor="">User Address</label>
          <span>{employeeSelfDetail.address}</span>
        </li>
        <li className="detail">
          <label htmlFor="">Your Mobile Number</label>
          <span>{employeeSelfDetail.mobile}</span>
        </li>
        <li className="detail">
          <label htmlFor="">Your Annual Salary</label>
          <span>{employeeSelfDetail.annualSalary}</span>
        </li>
        <li className="detail">
          <label htmlFor="">Your Job Position</label>
          <span>{employeeSelfDetail.jobTitle}</span>
        </li>
      </ul>
    </div>
  );
};

export default EmployeeDashBoard;
