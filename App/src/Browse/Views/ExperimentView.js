import React from "react";
import ItemsView from "./ItemsView";

function ExperimentView({ experiments, onItemClick, parentPath }) {
  return (
    <ItemsView
      title="Experiments"
      items={experiments}
      searchKeys={["name", "samples"]}
      titleKey="name"
      onItemClick={onItemClick} // Pass the onItemClick callback
      parentPath={parentPath}
    />
  );
}

export default ExperimentView;
