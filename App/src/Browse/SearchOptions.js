import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function SearchOptions() {
  const [projectList, setProjectList] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null); // To handle any potential error
  const navigate = useNavigate();

  // Fetch project data from the server
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/dropbox/projects?limit=10&page=1"
        );
        const data = await response.json();
        console.log(data);
        setProjectList([...data.projects]);
      } catch (error) {
        console.error("Error fetching project data:", error);
        setErrorMessage("Failed to fetch project data.");
      }
    };
    fetchProjects();
  }, []);

  const handleProjectClick = () => {
    navigate("/hierarchy-view");
  };

  const handlePDataClick = () => {
    console.log(projectList);

    // Flatten the project structure to extract all results
    const allResults = projectList.flatMap((project) =>
      (project.research_questions || []).flatMap((question) =>
        (question.experiments || []).flatMap((experiment) =>
          (experiment.samples || []).flatMap((sample) => sample.results || [])
        )
      )
    );

    // Navigate to the processed data view, passing the flattened results
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

            {errorMessage && (
              <div className="mt-3 text-center text-danger">{errorMessage}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchOptions;
