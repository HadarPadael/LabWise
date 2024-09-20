import React from "react";
import ItemsView from "./ItemsView";

function ResultsView({ results }) {
  const handleItemClick = (item) => {
    window.open(item.file_link, "_blank");
  };

  return (
    <ItemsView
      title="Results"
      items={results}
      searchKeys={["name"]}
      titleKey="name"
      onItemClick={handleItemClick}
    />
  );
}

export default ResultsView;
