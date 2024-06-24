import React, { useEffect, useRef } from "react";
import ResearchQuestion from "../Views/ResearchQuestion";

function Carousel({ projects, initialProject }) {
  const carouselRef = useRef(null);

  useEffect(() => {
    const bootstrap = require("bootstrap"); // Import Bootstrap
    const myCarouselElement = document.getElementById(
      "carouselExampleIndicators"
    );

    if (myCarouselElement) {
      const carousel = new bootstrap.Carousel(myCarouselElement, {
        interval: false,
        touch: false,
      });

      carouselRef.current = carousel;
      console.log("Carousel initialized with interval: false and touch: false");
    } else {
      console.log("Failed to find carousel element");
    }
  }, []);

  const initialIndex = projects.findIndex(
    (p) => p.project_name === initialProject.project_name
  );

  const handlePrev = () => {
    if (carouselRef.current) {
      console.log("Navigating to previous slide");
      carouselRef.current.prev();
    } else {
      console.log("Carousel reference is null");
    }
  };

  const handleNext = () => {
    if (carouselRef.current) {
      console.log("Navigating to next slide");
      carouselRef.current.next();
    } else {
      console.log("Carousel reference is null");
    }
  };

  return (
    <div id="carouselExampleIndicators" className="carousel slide">
      <div className="carousel-indicators">
        {projects.map((_, index) => (
          <button
            key={index}
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to={index}
            className={index === initialIndex ? "active" : ""}
            aria-current={index === initialIndex ? "true" : ""}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>
      <div className="carousel-inner">
        {projects.map((project, index) => (
          <div
            key={index}
            className={`carousel-item ${
              index === initialIndex ? "active" : ""
            }`}
          >
            <div className="d-flex justify-content-between align-items-center">
              <img
                src="./caret-left.svg"
                alt="Previous"
                style={{
                  cursor: "pointer",
                  width: "30px",
                  height: "30px",
                  marginRight: "50px",
                }}
                onClick={handlePrev}
              />
              <div className="card p-4 shadow" style={{ flex: 1 }}>
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                  <h1 className="card-title">
                    {project.project_name}
                    <img
                      src="./download.svg"
                      alt="Download"
                      className="ml-2"
                      style={{
                        cursor: "pointer",
                        width: "24px",
                        height: "24px",
                        marginLeft: "10px",
                      }}
                    />
                  </h1>
                </div>
                <div className="card-body">
                  <p className="card-text">{project.free_description}</p>
                  <p>
                    <strong>Official Name:</strong> {project.official_name}
                  </p>
                  <p>
                    <strong>Creator:</strong> {project.creator_name}
                  </p>
                  <p>
                    <strong>Creation Date:</strong> {project.creation_date}
                  </p>

                  <h2>Research Questions</h2>
                  {project.research_questions.map((question, qIndex) => (
                    <ResearchQuestion key={qIndex} question={question} />
                  ))}
                </div>
              </div>
              <img
                src="./caret-right.svg"
                alt="Next"
                style={{
                  cursor: "pointer",
                  width: "30px",
                  height: "30px",
                  marginLeft: "50px",
                }}
                onClick={handleNext}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Carousel;
