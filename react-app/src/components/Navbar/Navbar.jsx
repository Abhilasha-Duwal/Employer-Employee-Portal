import React from "react";
import getCurrentUser from "../../utility/getUser"
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/UserSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const CURRENT_USER = getCurrentUser();

  const handleLogout = () => {
    // Dispatch logout action
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <div className="navbar-wrapper">
    <div className="navbar">
      {!CURRENT_USER ? (
        <>
          <p className="home-title">We Come to the Employee-Employer Portal</p>
        </>
      ) : (
        <>
          <Link to="/" className="nav-link-home">
            <p>Employee-Employer</p>
          </Link>
          <div className="nav-link-user">
            <p>Welcome! {CURRENT_USER.username}.</p>
          </div>
          <ul className="nav-menu">
            <li onClick={handleLogout}>Logout</li>
          </ul>
        </>
      )}
    </div>
    </div>
  );
};

export default Navbar;
