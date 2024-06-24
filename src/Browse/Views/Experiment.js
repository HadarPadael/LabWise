import React, { useState } from "react";
import Sample from "./Sample";

function Experiment({ experiment }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-2">
      <div className="card" style={{ cursor: "pointer", marginLeft: "20px" }}>
        <div
          className="card-header bg-success text-white d-flex justify-content-between align-items-center"
          onClick={toggleOpen}
        >
          <h5 className="card-title">Experiment {experiment.experiment_id}</h5>
          <img
            src="./download.svg"
            alt="Download"
            style={{ cursor: "pointer", width: "24px", height: "24px" }}
          />
        </div>
        {isOpen && (
          <div className="card-body">
            <p>
              <strong>Number of Samples:</strong> {experiment.number_of_samples}
            </p>
            <p>
              <strong>Model Animal:</strong> {experiment.model_animal}
            </p>
            <p>
              <strong>Age:</strong> {experiment.age}
            </p>
            <p>
              <strong>Species:</strong> {experiment.animal_species}
            </p>
            <p>{experiment.free_description}</p>
            <p>
              <strong>Official Name:</strong> {experiment.official_name}
            </p>
            <p>
              <strong>Creator:</strong> {experiment.creator_name}
            </p>
            <p>
              <strong>Creation Date:</strong> {experiment.creation_date}
            </p>

            <h6>Samples</h6>
            {experiment.samples.map((sample, sIndex) => (
              <Sample key={sIndex} sample={sample} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Experiment;
