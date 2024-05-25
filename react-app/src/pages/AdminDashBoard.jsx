import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {useDispatch, useSelector } from "react-redux";
import "./CSS/DashBoard.css";
import { fetchEmployers, selectEmployers } from "../redux/EmployerSlice";

const DashBoard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const employers = useSelector(selectEmployers); // Get employers state from Redux

  useEffect(() => {
    dispatch(fetchEmployers())
      .then((result) => {
        console.log("Employers fetched successfully:", result);
      })
      .catch((error) => {
        console.error("Error fetching employers:", error);
      });
  }, [dispatch]);

  console.log("home-employers",employers)

  return (
    <div className="dashboard container">
      <button className="dashboard-button" onClick={()=>navigate("/register")}>ADD NEW EMPLOYER</button>
      <table>
        <caption>Employers Table</caption>
        <thead>
          <tr>
            <th>S.N</th>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Annual Salary</th>
            <th>Job Title</th>
            <th>User Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employers?.map((employer, index) => {
            return (
              <tr key={index}>
                <td>{index+1}</td>
                <td>{employer.username}</td>
                <td>{employer.email}</td>
                <td>{employer.address}</td>
                <td>{employer.annualSalary}</td>
                <td>{employer.jobTitle}</td>
                <td>{employer.userRole}</td>
                <td>
                  <button>Edit</button>
                  <button>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DashBoard;