import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.css"; 

function AddOptions() {
  const navigate = useNavigate();

  const handleProjectClick = () => {
    navigate("/AddProject");
  };

  const handlePDataClick = () => {
    navigate("/"); // Add the correct route here
  };

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="background-layer">
        <div
          className="card p-4 shadow card-custom"
          style={{ minWidth: "500px", minHeight: "300px" }}
        >
          <div className="d-flex flex-column align-items-center">
            <h2
              className="app-name mb-2"
              style={{ fontSize: "36px", color: "#333", textAlign: "center" }}
            >
              What would you like to add?
            </h2>
            <div
              className="row justify-content-center mt-4"
              style={{ width: "100%" }}
            >
              <div className="col-12 col-md-6 d-flex justify-content-center">
                <div className="option-box" onClick={handleProjectClick}>
                  <img
                    src="./folder-plus.svg"
                    alt="Add Project"
                    className="option-image"
                  />
                  <button
                    className="btn btn-link option-text"
                    style={{ fontSize: "24px" }}
                  >
                    A new project
                  </button>
                  <div className="option-description">
                    Add a new project or a sub part of an existing project.
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 d-flex justify-content-center">
                <div className="option-box" onClick={handlePDataClick}>
                  <img
                    src="./bar-chart-line.svg"
                    alt="Processed Data"
                    className="option-image"
                  />
                  <button
                    className="btn btn-link option-text"
                    style={{ fontSize: "24px" }}
                  >
                    Processed data
                  </button>
                  <div className="option-description">
                    Add new processed data to your lab inventory.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddOptions;
