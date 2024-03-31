import React, { useState } from 'react';
import Navbar from './Navbar/Navbar';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
    <div style={{ backgroundColor: '#111222', height: '100%' }}> {/* Set background color */}
        <Navbar
          doSearch={doSearch}
        />
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage/>} />
      <Route path="/AddOptions" element={<AddOptions />}/>
      <Route path="/SearchOptions" element={<SearchOptions />}/>
      <Route path="/AddProject" element={<AddProject />}/>

    </Routes>
    </div>
  </BrowserRouter>

  );
}

export default App;

