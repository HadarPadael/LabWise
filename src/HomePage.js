import React from 'react';
import { useNavigate } from "react-router-dom";


function HomePage() {
    const navigate = useNavigate();

    const handleAddClick = () => {
        navigate("/AddOptions");
    };

    const handleSearchClick = () => {
        navigate("/SearchOptions");
    };

  return (
     <div class="container" >
      <div className="d-flex flex-row align-items-center">
        <img src="./labwise logo.png" alt="facybook" width="200" height="200" />
      </div>

        <h1>Welcome to Home Screen! </h1>
        <div class="row justify-content-center"> 
          <button type="button" class="btn btn-dark btn-circle btn-xl" onClick={handleAddClick} >Add</button>
          <button type="button" class="btn btn-dark btn-circle btn-xl" onClick={handleSearchClick}>Search</button>
        </div>
      </div> 
  );
}

export default HomePage;