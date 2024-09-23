import React, { useState, useEffect } from "react";
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
  const [currentPath, setCurrentPath] = useState("/labwise"); // Start at the root
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Current Path Updated: ", currentPath);
  }, [currentPath]);

  const goBack = () => {
    if (history.length > 0) {
      const lastState = history.pop();
      setHistory([...history]);
      setSelectedProject(lastState.selectedProject);
      setSelectedQuestion(lastState.selectedQuestion);
      setSelectedExperiment(lastState.selectedExperiment);
      setSelectedSample(lastState.selectedSample);
      setCurrentPath(lastState.currentPath); // Restore the path from history
    }
  };

  const handleProjectClick = (project) => {
    const newPath = `${currentPath}/${project.name}`;
    setHistory([
      ...history,
      {
        selectedProject,
        selectedQuestion,
        selectedExperiment,
        selectedSample,
        currentPath,
      },
    ]);
    setCurrentPath(newPath); // Update the path
    setSelectedProject(project);
    setSelectedQuestion(null);
    setSelectedExperiment(null);
    setSelectedSample(null);
  };

  const handleQuestionClick = (question) => {
    const newPath = `${currentPath}/${question.name}`;
    setHistory([
      ...history,
      {
        selectedProject,
        selectedQuestion,
        selectedExperiment,
        selectedSample,
        currentPath,
      },
    ]);
    setCurrentPath(newPath); // Update the path
    setSelectedQuestion(question);
    setSelectedExperiment(null);
    setSelectedSample(null);
  };

  const handleExperimentClick = (experiment) => {
    const newPath = `${currentPath}/${experiment.name}`;
    setHistory([
      ...history,
      {
        selectedProject,
        selectedQuestion,
        selectedExperiment,
        selectedSample,
        currentPath,
      },
    ]);
    setCurrentPath(newPath); // Update the path
    setSelectedExperiment(experiment);
    setSelectedSample(null);
  };

  const handleSampleClick = (sample) => {
    const newPath = `${currentPath}/${sample.name}`;
    setHistory([
      ...history,
      {
        selectedProject,
        selectedQuestion,
        selectedExperiment,
        selectedSample,
        currentPath,
      },
    ]);
    setCurrentPath(newPath); // Update the path
    setSelectedSample(sample);
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

      {/* Project Level */}
      {!selectedProject && (
        <div style={{ height: "400px", overflowY: "auto" }}>
          <ProjectView
            onItemClick={handleProjectClick}
            parentPath={currentPath}
          />
        </div>
      )}

      {/* Research Question Level */}
      {selectedProject && !selectedQuestion && (
        <div style={{ height: "400px", overflowY: "auto" }}>
          <ResearchQuestionView
            researchQuestions={selectedProject.research_questions || []} // Always pass an array
            onItemClick={handleQuestionClick}
            parentPath={currentPath} // Pass the parent path here
          />
        </div>
      )}

      {/* Experiment Level */}
      {selectedQuestion && !selectedExperiment && (
        <div style={{ height: "400px", overflowY: "auto" }}>
          <ExperimentView
            experiments={selectedQuestion.experiments || []} // Always pass an array
            onItemClick={handleExperimentClick}
            parentPath={currentPath} // Pass the parent path here
          />
        </div>
      )}

      {/* Sample Level */}
      {selectedExperiment && !selectedSample && (
        <div style={{ height: "400px", overflowY: "auto" }}>
          <SampleView
            samples={selectedExperiment.samples || []} // Always pass an array
            onItemClick={handleSampleClick}
            parentPath={currentPath} // Pass the parent path here
          />
        </div>
      )}

      {/* Results Level */}
      {selectedSample && (
        <div style={{ height: "400px", overflowY: "auto" }}>
          <ResultsView
            results={selectedSample.results || []} // Always pass an array
            parentPath={currentPath}
          />
        </div>
      )}
    </div>
  );
}

export default HierarchyView;
