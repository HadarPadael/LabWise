import React from "react";
import ItemsView from "./ItemsView";
import projects from "../../Data/projects.json";

function ProjectView({ onItemClick }) {
  return (
    <ItemsView
      title="Projects"
      items={projects}
      searchKeys={["project_name", "research_questions"]}
      titleKey="project_name"
      onItemClick={onItemClick} // Pass the onItemClick callback
    />
  );
}

export default ProjectView;
