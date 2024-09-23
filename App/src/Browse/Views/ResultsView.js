import React from "react";
import ItemsView from "./ItemsView";

function ResultsView({ results, parentPath }) {
  const handleItemClick = async (item) => {
    try {
      // Call the backend to get a shareable Dropbox link
      const response = await fetch(
        "http://localhost:5000/api/dropbox/getShareableLink",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ filePath: item.path }), // Send Dropbox file path
        }
      );

      const data = await response.json();
      if (response.ok) {
        // Open the shareable URL in a new tab
        window.open(data.url, "_blank");
      } else {
        console.error("Failed to get the shareable link.");
      }
    } catch (error) {
      console.error("Error fetching shareable link:", error);
    }
  };

  return (
    <ItemsView
      title="Results"
      items={results}
      searchKeys={["name"]}
      titleKey="name"
      onItemClick={handleItemClick}
      parentPath={parentPath}
    />
  );
}

export default ResultsView;
