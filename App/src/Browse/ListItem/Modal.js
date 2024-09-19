import React from "react";
import "./Modal.css"; 

const Modal = ({ onClose, content }) => {
  // Split the content by new lines to display each line as a separate paragraph
  const descriptionLines = content
    .split("\n")
    .map((line, index) => <p key={index}>{line}</p>);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Description</h2>
          <button className="close-btn" onClick={onClose}>
            &times; {/* Close Icon */}
          </button>
        </div>
        <div className="modal-body">{descriptionLines}</div>
      </div>
    </div>
  );
};

export default Modal;
