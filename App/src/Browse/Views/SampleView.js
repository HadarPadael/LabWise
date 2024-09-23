import React from "react";
import ItemsView from "./ItemsView";

function SampleView({ samples, onItemClick, parentPath }) {
  return (
    <ItemsView
      title="Samples"
      items={samples}
      searchKeys={["name", "results"]}
      titleKey="name"
      onItemClick={onItemClick} // Pass the onItemClick callback
      parentPath={parentPath}
    />
  );
}

export default SampleView;
