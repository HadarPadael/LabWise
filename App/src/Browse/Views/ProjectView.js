import React, { useEffect, useState } from "react";
import ItemsView from "./ItemsView";

function ProjectView({ onItemClick }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/dropbox/projects?limit=10&page=1"
        );
        const data = await response.json();
        console.log("Data fetched:", data); // Logging to verify fetched data
        setProjects([...data]); // Make sure the state is updated with a new array reference
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching projects:", error);
        setLoading(false); // Ensure loading is false in case of error
      }
    };

    fetchProjects();
  }, []); // Empty dependency array to run only on mount

  
if (loading) {
  return (
    <div className="loading-container">
      <div className="loading-text">
        Loading projects
        <span className="dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </span>
      </div>
    </div>
  );
}

  return (
    <div>
      {/* Only render ItemsView if projects exist */}
      {projects.length > 0 ? (
        <ItemsView
          title="Projects"
          items={projects}
          searchKeys={["project_name", "research_questions"]}
          titleKey="project_name"
          onItemClick={onItemClick} // Pass the onItemClick callback
        />
      ) : (
        <p>No projects available.</p> // Message for empty projects array
      )}
    </div>
  );

}

export default ProjectView;
