import React, { useState } from "react";

function Sample({ sample }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-1">
      <div className="card" style={{ cursor: "pointer", marginLeft: "40px" }}>
        <div
          className="card-header bg-warning text-white d-flex justify-content-between align-items-center"
          onClick={toggleOpen}
        >
          <p className="card-title">
            <strong>Sample ID:</strong> {sample.sample_id}
          </p>
          <img
            src="./download.svg"
            alt="Download"
            style={{ cursor: "pointer", width: "24px", height: "24px" }}
          />
        </div>
        {isOpen && (
          <div className="card-body">
            <p>{sample.description}</p>

            <h6>Readouts</h6>
            {sample.readouts.map((readout, rIndex) => (
              <div key={rIndex} style={{ marginLeft: "20px" }}>
                <p>
                  <strong>Readout Name:</strong> {readout.readout_name}
                </p>
                <p>{readout.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Sample;
