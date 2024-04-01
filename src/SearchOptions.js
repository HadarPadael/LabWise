import React from 'react';
import { useNavigate } from "react-router-dom";


function SearchOptions() {
  const navigate = useNavigate();

  const handleProjectClick = () => {
    navigate("/"); /////////////////////////////////////////////
};

const handlePDataClick = () => {
    navigate("/"); //////////////////////////////////////////////
};

const handleRDataClick = () => {
  navigate("/"); //////////////////////////////////////////////
};

  return (
<div class="container" >
  <h1>Search Options: </h1>
  <div class="row justify-content-center"> 
    <button type="button" class="btn btn-dark btn-circle btn-xl" onClick={handleProjectClick} >projects</button>
    <button type="button" class="btn btn-dark btn-circle btn-xl" onClick={handlePDataClick}>proccessed data</button>
    <button type="button" class="btn btn-dark btn-circle btn-xl" onClick={handleRDataClick}>raw data</button>

  </div>
</div> 
  );
}

export default SearchOptions;
