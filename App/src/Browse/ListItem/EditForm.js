import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
            description,
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
    <div className="container" style={{ maxWidth: "600px", marginTop: "20px" }}>
      <h1 className="text-center" style={{ color: "#007bff" }}>
        Edit Description
      </h1>
      <form>
        <div className="form-group mb-3">
          <label style={{ color: "#007bff" }}>Description:</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={10} // Provide enough space for multi-line text
            style={{ borderColor: "#007bff" }}
          />
        </div>
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            style={{ backgroundColor: "#007bff", borderColor: "#007bff" }}
          >
            Submit Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditForm;
