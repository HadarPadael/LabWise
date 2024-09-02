import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import projects from "../Data/projects.json";

function AddProcessedData() {
  const [projectList, setProjectList] = useState(projects);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [selectedExperiment, setSelectedExperiment] = useState("");
  const [selectedSample, setSelectedSample] = useState("");
  const [newProcessedData, setNewProcessedData] = useState({
    file_name: "",
    file_link: "",
    description: "",
    type: "readout", // Default type
  });
  const [file, setFile] = useState(null);

  const navigate = useNavigate();

  const handleProjectChange = (e) => {
    setSelectedProject(e.target.value);
    setSelectedQuestion(""); // Reset lower levels when project changes
    setSelectedExperiment("");
    setSelectedSample("");
  };

  const handleQuestionChange = (e) => {
    setSelectedQuestion(e.target.value);
    setSelectedExperiment(""); // Reset lower levels when question changes
    setSelectedSample("");
  };

  const handleExperimentChange = (e) => {
    setSelectedExperiment(e.target.value);
    setSelectedSample(""); // Reset lower level when experiment changes
  };

  const handleSampleChange = (e) => {
    setSelectedSample(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProcessedData({
      ...newProcessedData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setNewProcessedData({
      ...newProcessedData,
      file_name: e.target.files[0].name,
      file_link: `/src/Data/files/${e.target.files[0].name}`,
    });
  };

  const handleAddProcessedData = () => {
    if (!file) {
      alert("Please upload a file.");
      return;
    }

    const project = projectList.find((p) => p.project_name === selectedProject);
    if (!project) return;

    const question = project.research_questions.find(
      (q) => q.question === selectedQuestion
    );
    if (!question) return;

    const experiment = question.experiments.find(
      (exp) => exp.experiment_id.toString() === selectedExperiment
    );
    if (!experiment) return;

    const sample = experiment.samples.find(
      (samp) => samp.sample_id.toString() === selectedSample
    );
    if (!sample) return;

    sample.results.push(newProcessedData);

    setProjectList([...projectList]);
    navigate("/processed-data-view");
  };

  return (
    <div className="container" style={{ maxWidth: "600px", marginTop: "20px" }}>
      <h1 className="text-center" style={{ color: "#007bff" }}>
        Please fill out this form
      </h1>
      <form>
        <div className="form-group mb-3">
          <label style={{ color: "#007bff" }}>Select Project:</label>
          <select
            className="form-control"
            value={selectedProject}
            onChange={handleProjectChange}
            style={{ borderColor: "#007bff" }}
          >
            <option value="">-- Select a Project --</option>
            {projectList.map((project) => (
              <option key={project.project_name} value={project.project_name}>
                {project.project_name}
              </option>
            ))}
          </select>
        </div>

        {selectedProject && (
          <div className="form-group mb-3">
            <label style={{ color: "#007bff" }}>
              Select Research Question:
            </label>
            <select
              className="form-control"
              value={selectedQuestion}
              onChange={handleQuestionChange}
              style={{ borderColor: "#007bff" }}
            >
              <option value="">-- Select a Research Question --</option>
              {projectList
                .find((project) => project.project_name === selectedProject)
                ?.research_questions.map((question) => (
                  <option key={question.question} value={question.question}>
                    {question.question}
                  </option>
                ))}
            </select>
          </div>
        )}

        {selectedQuestion && (
          <div className="form-group mb-3">
            <label style={{ color: "#007bff" }}>Select Experiment:</label>
            <select
              className="form-control"
              value={selectedExperiment}
              onChange={handleExperimentChange}
              style={{ borderColor: "#007bff" }}
            >
              <option value="">-- Select an Experiment --</option>
              {projectList
                .find((project) => project.project_name === selectedProject)
                ?.research_questions.find(
                  (q) => q.question === selectedQuestion
                )
                ?.experiments.map((experiment) => (
                  <option
                    key={experiment.experiment_id}
                    value={experiment.experiment_id}
                  >
                    Experiment {experiment.experiment_id}
                  </option>
                ))}
            </select>
          </div>
        )}

        {selectedExperiment && (
          <div className="form-group mb-3">
            <label style={{ color: "#007bff" }}>Select Sample:</label>
            <select
              className="form-control"
              value={selectedSample}
              onChange={handleSampleChange}
              style={{ borderColor: "#007bff" }}
            >
              <option value="">-- Select a Sample --</option>
              {projectList
                .find((project) => project.project_name === selectedProject)
                ?.research_questions.find(
                  (q) => q.question === selectedQuestion
                )
                ?.experiments.find(
                  (exp) => exp.experiment_id.toString() === selectedExperiment
                )
                ?.samples.map((sample) => (
                  <option key={sample.sample_id} value={sample.sample_id}>
                    Sample {sample.sample_id}
                  </option>
                ))}
            </select>
          </div>
        )}

        {selectedSample && (
          <>
            <div className="form-group mb-3">
              <label style={{ color: "#007bff" }}>File Description:</label>
              <textarea
                className="form-control"
                name="description"
                value={newProcessedData.description}
                onChange={handleInputChange}
                style={{ borderColor: "#007bff" }}
              />
            </div>
            <div className="form-group mb-3">
              <label style={{ color: "#007bff" }}>Type:</label>
              <select
                className="form-control"
                name="type"
                value={newProcessedData.type}
                onChange={handleInputChange}
                style={{ borderColor: "#007bff" }}
              >
                <option value="readout">Readout</option>
                <option value="chart">Chart</option>
              </select>
            </div>
            <div className="form-group mb-3">
              <label style={{ color: "#007bff" }}>Upload File:</label>
              <input
                type="file"
                className="form-control"
                onChange={handleFileChange}
                style={{ borderColor: "#007bff" }}
                required
              />
            </div>
            <div className="d-flex justify-content-center">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddProcessedData}
                style={{ backgroundColor: "#007bff", borderColor: "#007bff" }}
              >
                Add Processed Data
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

export default AddProcessedData;
