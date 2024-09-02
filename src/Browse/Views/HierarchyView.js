import React, { useState } from "react";
import ProjectView from "./ProjectView";
import ResearchQuestionView from "./ResearchQuestionView";
import ExperimentView from "./ExperimentView";
import SampleView from "./SampleView";
import ResultsView from "./ResultsView";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function HierarchyView() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [selectedSample, setSelectedSample] = useState(null);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  const goBack = () => {
    if (history.length > 0) {
      const lastState = history.pop();
      setHistory([...history]);
      setSelectedProject(lastState.selectedProject);
      setSelectedQuestion(lastState.selectedQuestion);
      setSelectedExperiment(lastState.selectedExperiment);
      setSelectedSample(lastState.selectedSample);
    }
  };

  const handleProjectClick = (project) => {
    setHistory([
      ...history,
      { selectedProject, selectedQuestion, selectedExperiment, selectedSample },
    ]);
    setSelectedProject(project);
    setSelectedQuestion(null);
    setSelectedExperiment(null);
    setSelectedSample(null);
  };

  const handleQuestionClick = (question) => {
    setHistory([
      ...history,
      { selectedProject, selectedQuestion, selectedExperiment, selectedSample },
    ]);
    setSelectedQuestion(question);
    setSelectedExperiment(null);
    setSelectedSample(null);
  };

  const handleExperimentClick = (experiment) => {
    setHistory([
      ...history,
      { selectedProject, selectedQuestion, selectedExperiment, selectedSample },
    ]);
    setSelectedExperiment(experiment);
    setSelectedSample(null);
  };

  const handleSampleClick = (sample) => {
    setHistory([
      ...history,
      { selectedProject, selectedQuestion, selectedExperiment, selectedSample },
    ]);
    setSelectedSample(sample);
  };

  const handleViewDescription = (item) => {
    const description = `
      Name: ${
        item.project_name ||
        item.question ||
        item.experiment_id ||
        item.sample_id ||
        item.file_name
      }
      Description: ${
        item.free_description || item.description || "No description available"
      }
      Official Name: ${item.official_name || "N/A"}
      Creator Name: ${item.creator_name || "N/A"}
      Creation Date: ${item.creation_date || "N/A"}
    `;
    alert(description);
  };

  const handleEdit = (level, item) => {
    navigate("/edit-form", { state: { level, data: item } });
  };

  return (
    <div style={{ padding: "5px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "5px",
          height: "150px",
        }}
      >
        <button
          onClick={goBack}
          disabled={history.length === 0}
          style={{
            backgroundColor: "transparent",
            border: "none",
            cursor: history.length > 0 ? "pointer" : "not-allowed",
            color: history.length > 0 ? "#007bff" : "#ccc",
            fontSize: "24px",
            padding: "0 10px",
            marginRight: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <FaArrowLeft />
        </button>
      </div>

      {!selectedProject && (
        <div style={{ height: "400px", overflowY: "auto" }}>
          <ProjectView onItemClick={handleProjectClick} />
        </div>
      )}
      {selectedProject && !selectedQuestion && (
        <div style={{ height: "400px", overflowY: "auto" }}>
          <ResearchQuestionView
            researchQuestions={selectedProject.research_questions}
            onItemClick={handleQuestionClick}
          />
        </div>
      )}
      {selectedQuestion && !selectedExperiment && (
        <div style={{ height: "400px", overflowY: "auto" }}>
          <ExperimentView
            experiments={selectedQuestion.experiments}
            onItemClick={handleExperimentClick}
          />
        </div>
      )}
      {selectedExperiment && !selectedSample && (
        <div style={{ height: "400px", overflowY: "auto" }}>
          <SampleView
            samples={selectedExperiment.samples}
            onItemClick={handleSampleClick}
          />
        </div>
      )}
      {selectedSample && (
        <div style={{ height: "400px", overflowY: "auto" }}>
          <ResultsView results={selectedSample.results} />
        </div>
      )}
    </div>
  );
}

export default HierarchyView;
