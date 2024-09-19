import React from "react";
import { useNavigate } from "react-router-dom";
import Styles from "../styles/Styles";

function HomePage() {
  const navigate = useNavigate();

  const scrollToOptions = () => {
    document
      .getElementById("options-section")
      .scrollIntoView({ behavior: "smooth" });
  };

  const handleAddClick = () => {
    navigate("/AddOptions");
  };

  const handleBrowseClick = () => {
    navigate("/SearchOptions");
  };

  return (
    <div>
      <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="background-layer">
          <div
            className="card p-4 shadow card-custom"
            style={{ minWidth: "500px", minHeight: "200px" }}
          >
            <div className="d-flex flex-column align-items-center">
              <img
                src="./labwise logo.png"
                alt="LabWise logo"
                width="100"
                height="100"
                style={{ marginBottom: "20px" }}
              />
              <h2
                className="app-name mb-2"
                style={{ fontSize: "36px", color: "#333", textAlign: "center" }}
              >
                Welcome!
              </h2>
              <h1
                className="text-center mb-5"
                style={{
                  fontSize: "24px",
                  color: "#555",
                  textAlign: "center",
                  marginTop: "5px",
                  marginBottom: "100px",
                }}
              >
                What's todays' agenda?
              </h1>
              <div
                className="d-flex justify-content-center"
                style={{ width: "100%" }}
              >
                <button
                  className="btn btn-link"
                  onClick={scrollToOptions}
                  style={{ color: "black" }}
                >
                  <img
                    src="./arrow-bar-down.svg"
                    width="30"
                    height="30"
                    alt="Scroll Down"
                  />
                </button>
              </div>
            </div>
            <Styles />
          </div>
        </div>
      </div>
      <div id="options-section" className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 d-flex justify-content-center">
            <div className="option-box" onClick={handleAddClick}>
              <img src="./folder-plus.svg" alt="Add" className="option-image" />
              <button
                className="btn btn-link option-text"
                onClick={handleAddClick}
                style={{ fontSize: "24px" }}
              >
                Add
              </button>
              <div className="option-description">
                Add new items to your lab inventory.
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 d-flex justify-content-center">
            <div className="option-box" onClick={handleBrowseClick}>
              <img src="./search.svg" alt="Browse" className="option-image" />
              <button
                className="btn btn-link option-text"
                onClick={handleBrowseClick}
                style={{ fontSize: "24px" }}
              >
                Browse
              </button>
              <div className="option-description">
                Browse existing items in your lab inventory.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
