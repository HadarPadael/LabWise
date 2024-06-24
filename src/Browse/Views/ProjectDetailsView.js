import React from "react";
import { useLocation } from "react-router-dom";
import Carousel from "../Carousel/Carousel";

function ProjectDetailsView() {
  const location = useLocation();
  const { project, projects } = location.state || { project: {}, projects: [] };

  return (
    <div className="container mt-4">
      <Carousel projects={projects} initialProject={project} />
    </div>
  );
}

export default ProjectDetailsView;
