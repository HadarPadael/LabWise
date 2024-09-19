import React, { useEffect, useState } from "react";
import ItemsView from "./ItemsView";

function ProjectView({ onItemClick }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/dropbox/projects?limit=10&page=1"
      );
      const data = await response.json();
      console.log("Projects fetched from Firestore:", data.projects);
      setProjects([...data.projects]); // Load projects from Firestore
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects from Firestore:", error);
      setError(error.message);
      setLoading(false); // Stop loading if there's an error
    }
  };

  const loadToDB = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/dropbox/loadToDB",
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to load data to the database.");
      }
      console.log("Projects loaded from Dropbox to Firestore");
      await fetchProjects(); // Fetch projects from Firestore after loading from Dropbox
    } catch (error) {
      console.error("Error loading data to Firebase:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const initializeProjects = async () => {
    try {
      // Fetch projects from Firestore first
      const response = await fetch(
        "http://localhost:5000/api/dropbox/projects?limit=10&page=1"
      );
      const data = await response.json();

      if (data.projects.length === 0) {
        // No projects in Firestore, so load them from Dropbox
        console.log("No projects in Firestore. Loading from Dropbox...");
        await loadToDB();
      } else {
        // Projects exist in Firestore, use them
        console.log("Projects found in Firestore:", data.projects);
        setProjects([...data.projects]);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error initializing projects:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeProjects();
  }, []); // Only run this effect on mount

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

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div>
      {projects.length > 0 ? (
        <ItemsView
          title="Projects"
          items={projects}
          searchKeys={["project_name", "research_questions"]}
          titleKey="project_name"
          onItemClick={onItemClick}
        />
      ) : (
        <p>No projects available.</p>
      )}
    </div>
  );
}

export default ProjectView;
