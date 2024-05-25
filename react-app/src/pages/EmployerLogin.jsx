import React from "react";
import "./CSS/LoginSignup.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginEmployer } from "../redux/UserSlice";
import {
  setEmail,
  setPassword,
  resetForm,
  togglePasswordVisibility,
} from "../redux/FormSlice";

const EmployerLogin = () => {
 // redux state
 const { email, password, showPassword } = useSelector((state) => state.form);
 const { loading, error } = useSelector((state) => state.user);

 const dispatch = useDispatch();
 const navigate = useNavigate();

 const handleLogin = (e) => {
   e.preventDefault();
   let userCredentials = {
     email,
     password,
   };
   dispatch(loginEmployer(userCredentials)).then((result) => {
     if (result.payload) {
       dispatch(resetForm()); // Reset form after successful login
       navigate("/employer-dashboard");
     }
   });
 };

  return (
    <div className="loginsignup container">
      <form className="loginsignup-container" onSubmit={handleLogin}>
        <h1>Login</h1>
        <div className="loginsignup-fields">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => dispatch(setEmail(e.target.value))}
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => dispatch(setPassword(e.target.value))}
          />
          <span
            type="button"
            className="toggle-password"
            onClick={() => dispatch(togglePasswordVisibility())}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>
        <button type="submit">{loading ? "Loading..." : "Login"}</button>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default EmployerLogin;
