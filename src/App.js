import React, { useState } from 'react';
import AddOptions from './AddOptions';
import SearchOptions from './SearchOptions';
import Navbar from './Navbar/Navbar';
import "./App.css";

function App() {
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [showSearchOptions, setShowSearchOptions] = useState(false);
  const [filter, setFilter] = useState("");
  // State variable to track whether dark mode is enabled
  const [darkMode, setDarkMode] = useState(false);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prevDarkMode => !prevDarkMode);
  };
  // Apply dark mode styles conditionally
  const appStyle = darkMode ? "App dark-theme" : "App";

  const doSearch = function(q) {
    setFilter(q);
  };

  const scrollToTop = () => {
    document.querySelector('.centralFeed').scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePostSubmit = ({ text, image, date }) => {
  };

  const handleAddClick = () => {
    setShowAddOptions(true);
    setShowSearchOptions(false);
  };

  const handleSearchClick = () => {
    setShowSearchOptions(true);
    setShowAddOptions(false);
  };

  return (
    <div style={{ backgroundColor: '#222', height: '100%' }}> {/* Set background color */}
    <Navbar 
        updatePosts={handlePostSubmit}
        doSearch={doSearch} 
        onHomeButtonClick={scrollToTop} 
        toggleDarkMode={toggleDarkMode}
        darkMode={darkMode}
        // setIsLoggedIn={setIsLoggedIn}
      />
      
      
      <div class="container" >
      {/* <div className="d-flex flex-row align-items-center">
        <img src="./labwise logo.png" alt="facybook" width="200" height="200" />
      </div> */}

        <h1>Welcome to Home Screen! </h1>
        <div class="row justify-content-center"> 
          <button type="button" class="btn btn-dark btn-circle btn-xl" onClick={handleAddClick}>Add</button>
          <button type="button" class="btn btn-dark btn-circle btn-xl" onClick={handleSearchClick}>Search</button>
        </div>
      </div>

      {showAddOptions && <AddOptions />}
      {showSearchOptions && <SearchOptions />}
    </div>
  );
}

export default App;



// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
