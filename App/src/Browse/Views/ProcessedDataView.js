import React from "react";
import ItemsView from "./ItemsView";
import { useLocation } from "react-router-dom";

function ProcessedDataView() {
  const location = useLocation();
  const { items } = location.state;

  const handleItemClick = (item) => {
    alert(`You clicked on: ${item.file_name}`);
  };

  return (
    <ItemsView
      items={items}
      title="Processed Data"
      searchKeys={["file_name", "type"]}
      titleKey="file_name"
      onItemClick={handleItemClick}
      showAddButton={false} // Hide the "Add New" button
    />
  );
}

export default ProcessedDataView;
