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
      searchKeys={["file_name"]}
      titleKey="file_name"
      onItemClick={handleItemClick}
    />
  );
}

export default ResultsView;
