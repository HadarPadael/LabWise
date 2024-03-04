// Navbar.js
import React, { useState } from 'react';
import './Navbar.css';
import TooltipInitializer from './TooltipInitializer';
import Search from './Search';
import PostForm from './PostForm';
// import { useNavigate } from "react-router-dom";



function Navbar({ updatePosts, doSearch, onHomeButtonClick, toggleDarkMode, darkMode, setIsLoggedIn }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  // const navigate = useNavigate();

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleLogout = () => {
      // setIsLoggedIn(true);
      // navigate("/");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleAddPostClick = () => {
    setShowPostForm(true);
  };

  // Apply dark mode styles conditionally
  const navbarStyle = darkMode ? "darkStyle" : "style";
  const wordsStyle = darkMode ? "dark-color" : "my-color";


  return (
    <div>
      <nav className={`navbar navbar-expand-lg bg-body-tertiary my-navbar shadow rounded ${navbarStyle}`}>
      {/* Left corner content */}
      <div className="d-flex flex-row align-items-center">
        <img src="./labwise logo.png" alt="facybook" width="50" height="50" />
        <a className={`navbar-brand nav-header ${wordsStyle}`} href="#">LabWise</a>
      </div>

      {/* Right corner content */}
      <div className="d-flex align-items-center ms-auto">
        

        {/* Search component */}
        <Search doSearch={doSearch} />

        


        {/* Home button */}
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <button
              className="nav-link nav-icon-btn"
              id="homeBtn"
              data-bs-toggle="tooltip"
              data-bs-placement="bottom"
              title="Home"
              onClick={onHomeButtonClick}
            >
              <img src="./home-page-icon.svg" alt="Home" width="30" height="30" />
            </button>
          </li>
        </ul>

        {/* Dropdown Menu */}
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <div className="dropdown">
              <button
                className="nav-link nav-icon-btn"
                id="menuBtn"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded={showDropdown ? 'true' : 'false'}
                onClick={toggleDropdown}
              >
                <img src="./icons8-menu.svg" alt="Menu" width="30" height="30" />
              </button>
              <ul className={`dropdown-menu ${navbarStyle} ${showDropdown ? ' show' : ''}`}>
                <li>
                  <button className="dropdown-item" type="button" onClick={handleAddPostClick}>
                    Add Post
                  </button>
                </li>
              </ul>
            </div>
          </li>
        </ul>

        {/* Profile Dropdown */}
        <div className="dropdown">
          <button
            className="nav-link nav-icon-btn"
            id="profileBtn"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded={showProfileDropdown ? 'true' : 'false'}
            onClick={toggleProfileDropdown}
          >
            <img src="pictures/profile-picture.jpg" alt="Profile Picture" className="rounded-circle" width="30" height="30" />
          </button>

          <ul className={`dropdown-menu ${navbarStyle} ${showProfileDropdown ? ' show position' : ''}`}>
              <li>
                  <button className="dropdown-item" type="button" onClick={handleLogout}>
                    Log Out
                  </button>
              </li>
          </ul>
        </div>
      </div>
    </nav>
    {showPostForm && <PostForm update={updatePosts} setShowPost={setShowPostForm} darkMode={darkMode} />}

    </div>
  );
}

export default Navbar;

          
        
