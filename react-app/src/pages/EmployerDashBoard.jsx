import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./CSS/DashBoard.css";
import {
  fetchEmployees,
  selectEmployees,
  selectCurrentPage,
  selectEmployeesPerPage,
  setCurrentPage,
} from "../redux/EmployeeSlice";

const EmployerDashBoard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const employees = useSelector(selectEmployees); // Get employees state from Redux
  const currentPage = useSelector(selectCurrentPage);
  const employeesPerPage = useSelector(selectEmployeesPerPage);

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  const totalPages = Math.ceil(employees.length / employeesPerPage);

  const paginate = (pageNumber) => dispatch(setCurrentPage(pageNumber));

  useEffect(() => {
    dispatch(fetchEmployees())
      .then((result) => {
        console.log("Employees fetched successfully:", result);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });
  }, [dispatch]);

  console.log("home-employees", employees);

  return (
    <div className="dashboard container">
      <div className="button-wrapper">
        <button
          className="dashboard-button"
          onClick={() => navigate("/add-multiple-employess")}
        >
          ADD MULTIPLE EMPLOYEES
        </button>
        <button className="dashboard-button" onClick={() => navigate("/register")}>
          ADD NEW EMPLOYEE
        </button>
      </div>
      <table>
        <caption>Employees Table</caption>
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
          {currentEmployees?.map((employee, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{employee.username}</td>
                <td>{employee.email}</td>
                <td>{employee.address}</td>
                <td>{employee.annualSalary}</td>
                <td>{employee.jobTitle}</td>
                <td>{employee.userRole}</td>
                <td>
                  <button>Edit</button>
                  <button>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        {[...Array(totalPages).keys()].map((number) => (
          <button
            key={number + 1}
            onClick={() => paginate(number + 1)}
            className={currentPage === number + 1 ? "active" : ""}
          >
            {number + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmployerDashBoard;
