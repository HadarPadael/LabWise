import React, { useState } from "react";
import Navbar from "./Navbar/Navbar";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./login/login";
import SignUp from "./Signup/SignUp";
import HomePage from "./Home/HomePage";
import AddOptions from "./Add/AddOptions";
import SearchOptions from "./Browse/SearchOptions";
import AddProject from "./Add/AddProject";
import CreateItemsView from "./Browse/CreateItemsView/CreateItemsView";
import HierarchyView from "./Browse/Views/HierarchyView";
import "./App.css";
import EditForm from "./Browse/ListItem/EditForm";
import ProcessedDataView from "./Browse/Views/ProcessedDataView";
import AddProcessedData from "./Add/AddProcessedData";
import AddResultForm from "./Add/Forms/AddResultForm";

function App() {
  const [filter, setFilter] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Protected route component
  const ProtectedRoute = ({ element, ...rest }) => {
    return isLoggedIn ? element : <Navigate to="/" replace />;
  };

  const doSearch = function (q) {
    setFilter(q);
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
          <Route
            path="/AddProject"
            element={<ProtectedRoute element={<AddProject />} />}
          />
          <Route
            path="/CreateItemsView"
            element={
              <ProtectedRoute
                element={
                  <CreateItemsView
                    setIsLoggedIn={setIsLoggedIn}
                    doSearch={doSearch}
                  />
                }
              />
            }
          />
          <Route path="/hierarchy-view" element={<HierarchyView />} />
          <Route path="/edit-form" element={<EditForm />} />
          <Route path="/processed-data-view" element={<ProcessedDataView />} />
          <Route path="/AddProcessedData" element={<AddProcessedData />} />
          <Route path="/add-result-form" element={<AddResultForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
