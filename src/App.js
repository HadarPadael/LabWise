import React, { useState } from 'react';
import Navbar from './Navbar/Navbar';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./login/login";
import SignUp from './signup/SignUp';
import HomePage from './HomePage';
import AddOptions from './AddOptions'
import SearchOptions from './SearchOptions'
import AddProject from './AddProject/AddProject'
import "./App.css";

function App() {
  const [filter, setFilter] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Protected route component
  const ProtectedRoute = ({ element, ...rest }) => {
    return isLoggedIn ? element : <Navigate to="/" replace />;
  };

  const doSearch = function(q) {
    setFilter(q);
  };

  return (
    <BrowserRouter>
      <div style={{ backgroundColor: "#111222", height: "100%" }}>
        {" "}
        {/* Set background color */}
        <Navbar doSearch={doSearch} />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected route */}
          <Route
            path="/HomePage"
            element={
              <ProtectedRoute
                element={<HomePage setIsLoggedIn={setIsLoggedIn} />}
              />
            }
          />
          <Route
            path="/AddOptions"
            element={
              <ProtectedRoute
                element={<AddOptions setIsLoggedIn={setIsLoggedIn} />}
              />
            }
          />
          <Route
            path="/SearchOptions"
            element={
              <ProtectedRoute
                element={<SearchOptions setIsLoggedIn={setIsLoggedIn} />}
              />
            }
          />
          <Route
            path="/AddProject"
            element={
              <ProtectedRoute
                element={<AddProject setIsLoggedIn={setIsLoggedIn} />}
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

