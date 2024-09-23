import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Spinner,
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";

function AddForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null); // For file uploads at the 'results' level
  const [loading, setLoading] = useState(false); // Loading state to manage spinner visibility
  const [errorMessage, setErrorMessage] = useState(null); // To show error message in the form
  const navigate = useNavigate();
  const location = useLocation();
  const { level, parentPath } = location.state;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start showing loading spinner
    setErrorMessage(null); // Clear previous errors

    const formData = new FormData();
    formData.append("description", description);
    formData.append("level", level);
    formData.append("parentPath", parentPath);

    // Add file only if we are at the 'results' level
    if (level === "results") {
      if (!file) {
        setErrorMessage("Please upload a file.");
        setLoading(false); // Stop loading if no file is uploaded
        return;
      }
      formData.append("file", file);
    } else {
      formData.append("name", name);
    }

    try {
      const response = await fetch("http://localhost:5000/api/dropbox/addNew", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Item added successfully!");
        navigate(-1); // Go back after submission
      } else {
        setErrorMessage("Failed to add item.");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Stop loading when request finishes
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={20} lg={18}>
          {" "}
          <h2
            className="text-center mb-4"
            style={{ color: "#007bff", fontWeight: "bold", fontSize: "36px" }}
          >
            Add New {level === "results" ? "Result" : level}
          </h2>
          {/* Show loading spinner while the form is submitting */}
          {loading ? (
            <div style={{ textAlign: "center", margin: "20px" }}>
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
              <p>Submitting...</p>
            </div>
          ) : (
            <Form
              onSubmit={handleSubmit}
              className="p-5 shadow rounded"
              style={{ backgroundColor: "#f9f9f9" }}
            >
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

              {level !== "results" && (
                <Form.Group className="mb-4" controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter the name"
                    style={{
                      height: "50px",
                      fontSize: "16px",
                      padding: "10px",
                    }}
                    required
                  />
                </Form.Group>
              )}

              <Form.Group className="mb-4" controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter a brief description"
                  style={{ fontSize: "16px", padding: "10px" }}
                  required
                />
              </Form.Group>

              {level === "results" && (
                <Form.Group controlId="formFile" className="mb-4">
                  <Form.Label>Upload File</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handleFileChange}
                    required
                    style={{ fontSize: "16px", padding: "10px" }}
                  />
                </Form.Group>
              )}

              <Button
                variant="primary"
                type="submit"
                className="w-100"
                style={{ height: "50px", fontSize: "18px" }}
              >
                Submit
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default AddForm;
