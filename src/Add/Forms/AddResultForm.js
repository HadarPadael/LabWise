import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddResultForm() {
  const [newResult, setNewResult] = useState({
    file_name: "",
    file_link: "",
    description: "",
    type: "readout", // Default type
  });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewResult({
      ...newResult,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setNewResult({
      ...newResult,
      file_name: e.target.files[0].name,
      file_link: `/src/Data/files/${e.target.files[0].name}`,
    });
  };

  const handleAddResult = () => {
    if (!file) {
      alert("Please upload a file.");
      return;
    }
    // Logic to add the new result to the dataset
    navigate("/results-view"); // Navigate back to the results view
  };

  return (
    <div className="container" style={{ maxWidth: "600px", marginTop: "20px" }}>
      <h1 className="text-center" style={{ color: "#007bff" }}>
        Add New Result
      </h1>
      <form>
        <div className="form-group mb-3">
          <label style={{ color: "#007bff" }}>File Description:</label>
          <textarea
            className="form-control"
            name="description"
            value={newResult.description}
            onChange={handleInputChange}
            style={{ borderColor: "#007bff" }}
          />
        </div>
        <div className="form-group mb-3">
          <label style={{ color: "#007bff" }}>Type:</label>
          <select
            className="form-control"
            name="type"
            value={newResult.type}
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
            onClick={handleAddResult}
            style={{ backgroundColor: "#007bff", borderColor: "#007bff" }}
          >
            Add Result
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddResultForm;
