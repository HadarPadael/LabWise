import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import projects from "../Data/projects.json";

function AddProject() {
  const [projectList, setProjectList] = useState(projects);
  const [newProject, setNewProject] = useState({
    project_name: "",
    free_description: "",
    official_name: "",
    creator_name: "",
    creation_date: "",
    research_questions: [],
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject({
      ...newProject,
      [name]: value,
    });
  };

  const handleAddProject = () => {
    setProjectList([...projectList, newProject]);
    navigate("/");
  };

  return (
    <div className="container" style={{ maxWidth: "600px", marginTop: "20px" }}>
      <h1 className="text-center" style={{ color: "#007bff" }}>
        Please fill out this form
      </h1>
      <form>
        <div className="form-group mb-3">
          <label style={{ color: "#007bff" }}>Project Name:</label>
          <input
            type="text"
            className="form-control"
            name="project_name"
            value={newProject.project_name}
            onChange={handleInputChange}
            style={{ borderColor: "#007bff" }}
          />
        </div>
        <div className="form-group mb-3">
          <label style={{ color: "#007bff" }}>Free Description:</label>
          <textarea
            className="form-control"
            name="free_description"
            value={newProject.free_description}
            onChange={handleInputChange}
            style={{ borderColor: "#007bff" }}
          />
        </div>
        <div className="form-group mb-3">
          <label style={{ color: "#007bff" }}>Official Name:</label>
          <input
            type="text"
            className="form-control"
            name="official_name"
            value={newProject.official_name}
            onChange={handleInputChange}
            style={{ borderColor: "#007bff" }}
          />
        </div>
        <div className="form-group mb-3">
          <label style={{ color: "#007bff" }}>Creator Name:</label>
          <input
            type="text"
            className="form-control"
            name="creator_name"
            value={newProject.creator_name}
            onChange={handleInputChange}
            style={{ borderColor: "#007bff" }}
          />
        </div>
        <div className="form-group mb-3">
          <label style={{ color: "#007bff" }}>Creation Date:</label>
          <input
            type="date"
            className="form-control"
            name="creation_date"
            value={newProject.creation_date}
            onChange={handleInputChange}
            style={{ borderColor: "#007bff" }}
          />
        </div>
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddProject}
            style={{ backgroundColor: "#007bff", borderColor: "#007bff" }}
          >
            Add Project
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProject;
