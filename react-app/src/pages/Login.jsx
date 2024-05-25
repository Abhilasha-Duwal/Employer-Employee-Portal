import React from "react";
import "./CSS/Login.css"
import { Link } from "react-router-dom";

const Login = () => {
 
  return (
    <div className="login container">
     <p>Please choose Login role</p>
    <ul className="login-list-wrapper">
      <Link to="/admin-login"><li>Login as Admin</li></Link>
      <Link to="/employer-login"><li>Login as Employer</li></Link>
      <Link to="/employee-login"><li>Login as Employee</li></Link>
    </ul>
    </div>
  );
};

export default Login;