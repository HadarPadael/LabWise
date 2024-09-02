import React from "react";
import ItemsView from "./ItemsView";

function ResearchQuestionView({ researchQuestions, onItemClick }) {
  return (
    <ItemsView
      title="Research Questions"
      items={researchQuestions}
      searchKeys={["question", "experiments"]}
      titleKey="question"
      onItemClick={onItemClick} // Pass the onItemClick callback
    />
  );
}

export default ResearchQuestionView;
