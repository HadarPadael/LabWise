import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import projects from '../Data/projects.json';

function AddProject() {
    const navigate = useNavigate();
    const [projectList, setProjectList] = useState(projects);

    const handleAddButtonClick = () => {
        // Logic for adding a new project goes here
    };

    return (
        <div className="container">
            <h1>Projects:</h1>
            <ul className="list-group" style={{ width: '80%' }}>
                {projectList.map((project, index) => (

                    <li class="list-group-item d-flex justify-content-between align-items-center" key={index}>
                        <a href="https://example.com">{project.project_name} </a>
                        <div>
                            <i class=" bi bi-three-dots"></i>
                            <i class="bi bi-check-circle"></i>

                        </div>
                    </li>

                ))}

                
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <a href="https://example.com">example</a>
                    <div>
                        <i class=" bi bi-three-dots"></i>
                        <i class="bi bi-check-circle"></i>

                    </div>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <a href="https://example.com">example</a>
                    <div>
                        <i class=" bi bi-three-dots"></i>
                        <i class="bi bi-check-circle"></i>

                    </div>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <a href="https://example.com">example</a>
                    <div>
                        <i class=" bi bi-three-dots"></i>
                        <i class="bi bi-check-circle"></i>

                    </div>
                </li>
            </ul>
            <button type="button" className="btn btn-success mt-2" onClick={handleAddButtonClick}>
                Add
            </button>
        </div>
    );
}

export default AddProject;
