import React from "react";
import ItemsView from "./ItemsView";

function ExperimentView({ experiments, onItemClick }) {
  return (
    <ItemsView
      title="Experiments"
      items={experiments}
      searchKeys={["experiment_id", "samples"]}
      titleKey="experiment_id"
      onItemClick={onItemClick} // Pass the onItemClick callback
    />
  );
}

export default ExperimentView;
