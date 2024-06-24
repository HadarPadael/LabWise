import React, { useState } from "react";
import Experiment from "./Experiment";

function ResearchQuestion({ question }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-3">
      <div className="card" style={{ cursor: "pointer" }}>
        <div
          className="card-header bg-secondary text-white d-flex justify-content-between align-items-center"
          onClick={toggleOpen}
        >
          <h3 className="card-title">{question.question}</h3>
          <img
            src="./download.svg"
            alt="Download"
            style={{ cursor: "pointer", width: "24px", height: "24px" }}
          />
        </div>
        {isOpen && (
          <div className="card-body">
            <p>{question.free_description}</p>
            <p>
              <strong>Official Name:</strong> {question.official_name}
            </p>
            <p>
              <strong>Creator:</strong> {question.creator_name}
            </p>
            <p>
              <strong>Creation Date:</strong> {question.creation_date}
            </p>

            <h4>Experiments</h4>
            {question.experiments.map((experiment, eIndex) => (
              <Experiment key={eIndex} experiment={experiment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResearchQuestion;
