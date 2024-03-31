import React from 'react';
import { useNavigate } from "react-router-dom";

function AddOptions() {
  const navigate = useNavigate();

  const handleProjectClick = () => {
    navigate("/AddProject");
  };

  const handlePDataClick = () => {
    navigate("/"); //////////////////////////////////////////////
  };

  return (
    <div class="container" >
      <h1>Add Options: </h1>
      <div class="row justify-content-center">
        <button type="button" class="btn btn-dark btn-circle btn-xl" onClick={handleProjectClick} >project (or sub part of it)</button>
        <button type="button" class="btn btn-dark btn-circle btn-xl" onClick={handlePDataClick}>proccessed data</button>
      </div>
    </div>
  );
}

export default AddOptions;
