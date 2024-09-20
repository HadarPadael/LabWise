import React from "react";
import ItemsView from "./ItemsView";

function SampleView({ samples, onItemClick }) {
  return (
    <ItemsView
      title="Samples"
      items={samples}
      searchKeys={["name", "results"]}
      titleKey="name"
      onItemClick={onItemClick} // Pass the onItemClick callback
    />
  );
}

export default SampleView;
