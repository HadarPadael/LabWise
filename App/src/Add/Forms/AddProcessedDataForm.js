import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Spinner,
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";

function AddProcessedDataForm() {
  const [projectList, setProjectList] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [selectedExperiment, setSelectedExperiment] = useState("");
  const [selectedSample, setSelectedSample] = useState("");
  const [newProcessedData, setNewProcessedData] = useState({
    file_name: "",
    file_link: "",
    description: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state for server requests
  const [errorMessage, setErrorMessage] = useState(null); // Error message
  const navigate = useNavigate();

  // Fetch project data from Firebase
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/dropbox/projects?limit=10&page=1"
        );
        const data = await response.json();
        setProjectList([...data.projects]);
      } catch (error) {
        console.error("Error fetching project data:", error);
        setErrorMessage("Failed to fetch project data.");
      }
    };
    fetchProjects();
  }, []);

  // Handle changes in dropdown selections
  const handleProjectChange = (e) => {
    setSelectedProject(e.target.value);
    setSelectedQuestion("");
    setSelectedExperiment("");
    setSelectedSample("");
  };

  const handleQuestionChange = (e) => {
    setSelectedQuestion(e.target.value);
    setSelectedExperiment("");
    setSelectedSample("");
  };

  const handleExperimentChange = (e) => {
    setSelectedExperiment(e.target.value);
    setSelectedSample("");
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

  // Function to handle form submission
  const handleAddProcessedData = async (e) => {
    e.preventDefault();

    if (!file || !newProcessedData.description) {
      alert("Please fill in all fields and upload a file.");
      return;
    }

    // Construct parentPath based on the selections
    const parentPath = `/labwise/${selectedProject}/${selectedQuestion}/${selectedExperiment}/${selectedSample}`;

    setLoading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("description", newProcessedData.description);
    formData.append("level", "results");
    formData.append("parentPath", parentPath);
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/api/dropbox/addNew", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Processed Data added successfully!");
        navigate("/AddOptions"); // Redirect after successful submission
      } else {
        setErrorMessage("Failed to add Processed Data.");
      }
    } catch (error) {
      console.error("Error adding processed data:", error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={20} lg={18}>
          <h2
            className="text-center mb-4"
            style={{ color: "#007bff", fontWeight: "bold", fontSize: "36px" }}
          >
            Add Processed Data
          </h2>

          {loading ? (
            <div style={{ textAlign: "center", margin: "20px" }}>
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
              <p>Submitting...</p>
            </div>
          ) : (
            <Form
              onSubmit={handleAddProcessedData}
              className="p-5 shadow rounded"
              style={{ backgroundColor: "#f9f9f9" }}
            >
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

              {/* Project Selection */}
              <Form.Group className="mb-4">
                <Form.Label style={{ color: "#007bff" }}>
                  Select Project
                </Form.Label>
                <Form.Control
                  as="select"
                  value={selectedProject}
                  onChange={handleProjectChange}
                  style={{ height: "50px", fontSize: "16px" }}
                  required
                >
                  <option value="">-- Select a Project --</option>
                  {projectList.map((project) => (
                    <option key={project.name} value={project.name}>
                      {project.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              {/* Research Question Selection */}
              {selectedProject && (
                <Form.Group className="mb-4">
                  <Form.Label style={{ color: "#007bff" }}>
                    Select Research Question
                  </Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedQuestion}
                    onChange={handleQuestionChange}
                    style={{ height: "50px", fontSize: "16px" }}
                    required
                  >
                    <option value="">-- Select a Research Question --</option>
                    {projectList
                      .find((project) => project.name === selectedProject)
                      ?.research_questions.map((question) => (
                        <option key={question.name} value={question.name}>
                          {question.name}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
              )}

              {/* Experiment Selection */}
              {selectedQuestion && (
                <Form.Group className="mb-4">
                  <Form.Label style={{ color: "#007bff" }}>
                    Select Experiment
                  </Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedExperiment}
                    onChange={handleExperimentChange}
                    style={{ height: "50px", fontSize: "16px" }}
                    required
                  >
                    <option value="">-- Select an Experiment --</option>
                    {projectList
                      .find((project) => project.name === selectedProject)
                      ?.research_questions.find(
                        (q) => q.name === selectedQuestion
                      )
                      ?.experiments.map((experiment) => (
                        <option key={experiment.name} value={experiment.name}>
                          Experiment {experiment.name}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
              )}

              {/* Sample Selection */}
              {selectedExperiment && (
                <Form.Group className="mb-4">
                  <Form.Label style={{ color: "#007bff" }}>
                    Select Sample
                  </Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedSample}
                    onChange={handleSampleChange}
                    style={{ height: "50px", fontSize: "16px" }}
                    required
                  >
                    <option value="">-- Select a Sample --</option>
                    {projectList
                      .find((project) => project.name === selectedProject)
                      ?.research_questions.find(
                        (q) => q.name === selectedQuestion
                      )
                      ?.experiments.find(
                        (exp) => exp.name.toString() === selectedExperiment
                      )
                      ?.samples.map((sample) => (
                        <option key={sample.name} value={sample.name}>
                          Sample {sample.name}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
              )}

              {/* File Description */}
              {selectedSample && (
                <>
                  <Form.Group className="mb-4">
                    <Form.Label style={{ color: "#007bff" }}>
                      File Description
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="description"
                      value={newProcessedData.description}
                      onChange={handleInputChange}
                      placeholder="Enter a description for the file"
                      required
                    />
                  </Form.Group>

                  {/* File Upload */}
                  <Form.Group className="mb-4">
                    <Form.Label style={{ color: "#007bff" }}>
                      Upload File
                    </Form.Label>
                    <Form.Control
                      type="file"
                      onChange={handleFileChange}
                      required
                    />
                  </Form.Group>

                  {/* Submit Button */}
                  <div className="d-flex justify-content-center">
                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100"
                      style={{ height: "50px", fontSize: "18px" }}
                    >
                      Add Processed Data
                    </Button>
                  </div>
                </>
              )}
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default AddProcessedDataForm;
