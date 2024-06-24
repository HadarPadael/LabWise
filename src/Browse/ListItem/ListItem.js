import React from "react";
import { useNavigate } from "react-router-dom";

function ListItem({ name, items, projects }) {
  const navigate = useNavigate();

  const handleItemClick = () => {
    navigate("/ProjectDetailsView", {
      state: { project: items, projects: projects },
    });
  };

  return (
    <li
      className="list-group-item d-flex justify-content-between align-items-center"
      onClick={handleItemClick}
      style={{ cursor: "pointer" }}
    >
      <span style={{ color: "blue", textDecoration: "underline" }}>{name}</span>
      <div>
        <i className="bi bi-three-dots"></i>
        <i className="bi bi-check-circle"></i>
      </div>
    </li>
  );
}

export default ListItem;
