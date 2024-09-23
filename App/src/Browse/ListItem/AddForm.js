import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Spinner } from "react-bootstrap"; 

function AddForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null); // For file uploads at the 'results' level
  const [loading, setLoading] = useState(false); // Loading state to manage spinner visibility
  const navigate = useNavigate();
  const location = useLocation();
  const { level, parentPath } = location.state;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start showing loading spinner

    const formData = new FormData();
    formData.append("description", description);
    formData.append("level", level);
    formData.append("parentPath", parentPath);

    // Add file only if we are at the 'results' level
    if (level === "results") {
      if (!file) {
        alert("Please upload a file.");
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
        alert("Failed to add item.");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Stop loading when request finishes
    }
  };

  return (
    <div>
      <h2>Add New {level === "results" ? "Result" : level}</h2>

      {/* Show loading spinner while the form is submitting */}
      {loading ? (
        <div style={{ textAlign: "center", margin: "20px" }}>
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
          <p>Submitting...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {level !== "results" && (
            <div>
              <label>Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div>
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          {level === "results" && (
            <div>
              <label>Upload File:</label>
              <input type="file" onChange={handleFileChange} required />
            </div>
          )}
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}

export default AddForm;
