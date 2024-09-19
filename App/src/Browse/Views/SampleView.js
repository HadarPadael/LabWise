import React from "react";
import ItemsView from "./ItemsView";

function SampleView({ samples, onItemClick }) {
  return (
    <ItemsView
      title="Samples"
      items={samples}
      searchKeys={["sample_id", "results"]}
      titleKey="sample_id"
      onItemClick={onItemClick} // Pass the onItemClick callback
    />
  );
}

export default SampleView;
