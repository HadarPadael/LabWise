import React from "react";
import { useNavigate } from "react-router-dom";
import projects from "../Data/projects.json";
import "../App.css";

function SearchOptions() {
  const navigate = useNavigate();

  const handleProjectClick = () => {
    navigate("/hierarchy-view", {
      state: { items: projects, level: "projects" },
    });
  };

  const handlePDataClick = () => {
    const allResults = projects.flatMap((project) =>
      project.research_questions.flatMap((question) =>
        question.experiments.flatMap((experiment) =>
          experiment.samples.flatMap((sample) => sample.results)
        )
      )
    );

    navigate("/processed-data-view", {
      state: { items: allResults, level: "results" },
    });
  };

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="background-layer">
        <div
          className="card p-4 shadow card-custom"
          style={{ minWidth: "500px", minHeight: "200px" }}
        >
          <div className="d-flex flex-column align-items-center">
            <h2
              className="app-name mb-2"
              style={{ fontSize: "36px", color: "#333", textAlign: "center" }}
            >
              Choose your database
            </h2>
            <div
              className="row justify-content-center mt-4"
              style={{ width: "100%" }}
            >
              <div className="col-12 col-md-4 d-flex justify-content-center">
                <div className="option-box" onClick={handleProjectClick}>
                  <img
                    src="./archive.svg"
                    alt="Projects"
                    className="option-image"
                  />
                  <button
                    className="btn btn-link option-text"
                    style={{ fontSize: "24px" }}
                  >
                    Projects
                  </button>
                  <div className="option-description">
                    Search through all projects.
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4 d-flex justify-content-center">
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
                    Processed Data
                  </button>
                  <div className="option-description">
                    Search through processed data.
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

export default SearchOptions;
