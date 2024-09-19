import React, { useState, useEffect } from "react";
import ListItem from "../ListItem/ListItem";
import Search from "../../Navbar/Search";
import projects from "../../Data/projects.json";

function CreateItemsView() {
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [filteredExperiments, setFilteredExperiments] = useState([]);
  const [selectedExperiment, setSelectedExperiment] = useState(null);

  // Search logic for projects
  const matchesProjectSearchTerm = (term, item) => {
    if (!term) return true;
    const lowerTerm = term.toLowerCase();
    return item.project_name.toLowerCase().includes(lowerTerm);
  };

  const doProjectSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter((project) =>
        matchesProjectSearchTerm(searchTerm, project)
      );
      setFilteredProjects(filtered);
    }
  };

  // Handle project click
  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setFilteredQuestions(project.research_questions);
    setSelectedQuestion(null); // Reset question selection
    setFilteredExperiments([]); // Reset experiments
    setSelectedExperiment(null);
  };

  // Search logic for research questions
  const matchesQuestionSearchTerm = (term, item) => {
    if (!term) return true;
    const lowerTerm = term.toLowerCase();
    return item.question.toLowerCase().includes(lowerTerm);
  };

  const doQuestionSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredQuestions(
        selectedProject ? selectedProject.research_questions : []
      );
    } else {
      const filtered = selectedProject.research_questions.filter((question) =>
        matchesQuestionSearchTerm(searchTerm, question)
      );
      setFilteredQuestions(filtered);
    }
  };

  // Handle question click
  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
    setFilteredExperiments(question.experiments);
    setSelectedExperiment(null); // Reset experiment selection
  };

  // Search logic for experiments
  const matchesExperimentSearchTerm = (term, item) => {
    if (!term) return true;
    const lowerTerm = term.toLowerCase();
    return (
      item.experiment_id.toString().includes(lowerTerm) ||
      item.model_animal.toLowerCase().includes(lowerTerm) ||
      item.samples.some((sample) =>
        sample.sample_id.toString().includes(lowerTerm)
      )
    );
  };

  const doExperimentSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredExperiments(
        selectedQuestion ? selectedQuestion.experiments : []
      );
    } else {
      const filtered = selectedQuestion.experiments.filter((experiment) =>
        matchesExperimentSearchTerm(searchTerm, experiment)
      );
      setFilteredExperiments(filtered);
    }
  };

  const handleExperimentClick = (experiment) => {
    setSelectedExperiment(experiment);
  };

  return (
    <div className="container">
      {/* Project Search and List */}
      <h2>Select Project</h2>
      <Search doSearch={doProjectSearch} />
      <ul className="list-group" style={{ width: "100%" }}>
        {filteredProjects.map((project, key) => (
          <ListItem
            name={project.project_name}
            items={project}
            key={key}
            onClick={() => handleProjectClick(project)}
          />
        ))}
      </ul>

      {/* Research Question Search and List */}
      {selectedProject && (
        <>
          <h2>Research Questions for {selectedProject.project_name}</h2>
          <Search doSearch={doQuestionSearch} />
          <ul className="list-group" style={{ width: "100%" }}>
            {filteredQuestions.map((question, key) => (
              <ListItem
                name={question.question}
                items={question}
                key={key}
                onClick={() => handleQuestionClick(question)}
              />
            ))}
          </ul>
        </>
      )}

      {/* Experiment Search and List */}
      {selectedQuestion && (
        <>
          <h2>Experiments for {selectedQuestion.question}</h2>
          <Search doSearch={doExperimentSearch} />
          <ul className="list-group" style={{ width: "100%" }}>
            {filteredExperiments.map((experiment, key) => (
              <ListItem
                name={`Experiment ${experiment.experiment_id}`}
                items={experiment}
                key={key}
                onClick={() => handleExperimentClick(experiment)}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default CreateItemsView;
