import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import "./Navbar.css";

function Navbar({ setIsLoggedIn }) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token
    setIsLoggedIn(false); // Set login state to false
    navigate("/"); // Redirect to login page
    setShowProfileDropdown(!showProfileDropdown); //toggleUp
  };

  return (
    <div>
      <nav
        className={`navbar navbar-expand-lg bg-body-tertiary my-navbar shadow rounded`}
      >
        {/* Left corner content */}
        <div className="d-flex flex-row align-items-center">
          <img src="./labwise logo.png" width="30" height="30" />
          <a className={`navbar-brand nav-header`} href="#">
            LabWise
          </a>
        </div>

        {/* Right corner content */}
        <div className="d-flex align-items-center ms-auto">
          {/* Home button */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <button
                className="nav-link nav-icon-btn"
                id="homeBtn"
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                title="Home"
              >
                <img
                  src="./home-page-icon.svg"
                  alt="Home"
                  width="30"
                  height="30"
                />
              </button>
            </li>
          </ul>

          {/* Profile Dropdown */}
          <div className="dropdown">
            <button
              className="nav-link nav-icon-btn"
              id="profileBtn"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded={showProfileDropdown ? "true" : "false"}
              onClick={toggleProfileDropdown}
            >
              <FaUser className="rounded-circle" size={30} />
            </button>

            <ul
              className={`dropdown-menu ${
                showProfileDropdown ? " show position" : ""
              }`}
            >
              <li>
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
