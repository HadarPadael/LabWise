import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

function EditForm() {
  const location = useLocation();
  const { level, data } = location.state || {};
  const navigate = useNavigate();

  // Set the description state based on the existing description of the data
  const [description, setDescription] = useState(data?.description || "");

  const handleSubmit = async () => {
    // Logic to update the description in Dropbox
    try {
      const response = await fetch(
        "http://localhost:5000/api/dropbox/updateDescription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: data.path, // Path to the file in Dropbox
            description: description,
            type: level,
          }),
        }
      );

      if (response.ok) {
        alert("Description updated successfully!");
        navigate(-1); // Go back to the previous page
      } else {
        alert("Failed to update the description.");
      }
    } catch (error) {
      console.error("Error updating description:", error);
      alert("An error occurred. Please try again.");
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
            Edit Description
          </h2>

          <Form
            className="p-5 shadow rounded"
            style={{ backgroundColor: "#f9f9f9" }}
          >
            <Form.Group className="mb-4">
              <Form.Label style={{ color: "#007bff" }}>Description:</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  height: "150px",
                  fontSize: "16px",
                  borderColor: "#007bff",
                }}
                placeholder="Enter a new description here"
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-center">
              <Button
                variant="primary"
                type="button"
                className="w-100"
                style={{ height: "50px", fontSize: "18px" }}
                onClick={handleSubmit}
              >
                Submit Changes
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default EditForm;
