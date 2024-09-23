import React, { useState } from "react";
import Navbar from "./Navbar/Navbar";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./login/login";
import SignUp from "./Signup/SignUp";
import HomePage from "./Home/HomePage";
import AddOptions from "./Add/AddOptions";
import SearchOptions from "./Browse/SearchOptions";
import HierarchyView from "./Browse/Views/HierarchyView";
import "./App.css";
import EditForm from "./Add/Forms/EditForm";
import ProcessedDataView from "./Browse/Views/ProcessedDataView";
import AddProcessedDataForm from "./Add/Forms/AddProcessedDataForm";
import AddForm from "./Add/Forms/AddForm";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Protected route component
  const ProtectedRoute = ({ element, ...rest }) => {
    return isLoggedIn ? element : <Navigate to="/" replace />;
  };

  return (
    <BrowserRouter>
      {/* Set background color */}
      <div style={{ backgroundColor: "#ffffff", height: "100%" }}>
        <Navbar setIsLoggedIn={setIsLoggedIn} />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/Signup" element={<SignUp />} />

          {/* Protected route */}
          <Route
            path="/HomePage"
            element={<ProtectedRoute element={<HomePage />} />}
          />
          <Route
            path="/AddOptions"
            element={<ProtectedRoute element={<AddOptions />} />}
          />
          <Route
            path="/SearchOptions"
            element={<ProtectedRoute element={<SearchOptions />} />}
          />
          <Route path="/hierarchy-view" element={<HierarchyView />} />
          <Route path="/edit-form" element={<EditForm />} />
          <Route path="/processed-data-view" element={<ProcessedDataView />} />
          <Route
            path="/AddProcessedDataForm"
            element={<AddProcessedDataForm />}
          />
          <Route path="/add-form" element={<AddForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
