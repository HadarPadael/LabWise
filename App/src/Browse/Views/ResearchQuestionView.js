import React from "react";
import ItemsView from "./ItemsView";

function ResearchQuestionView({ researchQuestions, onItemClick, parentPath }) {
  return (
    <ItemsView
      title="Research Questions"
      items={researchQuestions}
      searchKeys={["name", "experiments"]}
      titleKey="name"
      onItemClick={onItemClick} // Pass the onItemClick callback
      parentPath={parentPath}
    />
  );
}

export default ResearchQuestionView;
