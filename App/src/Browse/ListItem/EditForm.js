import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function EditForm() {
  const location = useLocation();
  const { level, data } = location.state || {};
  const navigate = useNavigate();

  const fieldMapping = {
    projects: {
      project_name: "Project Name",
      free_description: "Description",
      official_name: "Official Name",
      creator_name: "Creator Name",
      creation_date: "Creation Date",
    },
    "research questions": {
      question: "Research Question",
      free_description: "Description",
      official_name: "Official Name",
      creator_name: "Creator Name",
      creation_date: "Creation Date",
    },
    experiments: {
      experiment_id: "Experiment ID",
      number_of_samples: "Number of Samples",
      model_animal: "Model Animal",
      age: "Age",
      animal_species: "Animal Species",
      free_description: "Description",
      official_name: "Official Name",
      creator_name: "Creator Name",
      creation_date: "Creation Date",
    },
    samples: {
      sample_id: "Sample ID",
      description: "Description",
    },
    results: {
      file_name: "File Name",
      file_link: "File Link",
    },
  };

  const [formData, setFormData] = useState(
    data ||
      Object.fromEntries(
        Object.keys(fieldMapping[level] || {}).map((key) => [key, ""])
      )
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    alert(`${level} updated successfully!`);
    navigate(-1);
  };

  if (!level || !fieldMapping[level]) {
    return <p>Error: Unable to load form. Please try again.</p>;
  }

  return (
    <div className="container" style={{ maxWidth: "600px", marginTop: "20px" }}>
      <h1 className="text-center" style={{ color: "#007bff" }}>
        {data ? `Edit ${level}` : `Add New ${level.slice(0, -1)}`}
      </h1>
      <form>
        {Object.keys(fieldMapping[level]).map((key) => (
          <div className="form-group mb-3" key={key}>
            <label style={{ color: "#007bff" }}>
              {fieldMapping[level][key]}:
            </label>
            <input
              type="text"
              className="form-control"
              name={key}
              value={formData[key]}
              onChange={handleInputChange}
              style={{ borderColor: "#007bff" }}
            />
          </div>
        ))}
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            style={{ backgroundColor: "#007bff", borderColor: "#007bff" }}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditForm;
