import React, { useState, useEffect } from "react";
import ListItem from "../ListItem/ListItem";
import Search from "../../Navbar/Search";
import projects from "../../Data/projects.json"; 

function CreateItemsView() {
  const [filteredItems, setFilteredItems] = useState(projects);

  const doSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredItems(projects);
    } else {
      const filtered = projects.filter(
        (project) =>
          project.project_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          project.research_questions.some((question) =>
            question.question.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
      setFilteredItems(filtered);
    }
  };

  const itemList = filteredItems.map((project, key) => (
    <ListItem name={project.project_name} items={project} key={key} projects={projects} />
  ));

  return (
    <div className="container">
      <Search doSearch={doSearch} />
      <ul className="list-group" style={{ width: "100%" }}>
        {itemList}
      </ul>
    </div>
  );
}

export default CreateItemsView;
