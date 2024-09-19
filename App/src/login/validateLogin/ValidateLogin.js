import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateFormsList from "../createFormList/createFormList";
import Styles from "../../styles/Styles";

function ValidateLogin({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

 
 const handleSubmit = async (event) => {
   event.preventDefault();

   try {
     const response = await fetch("http://localhost:5000/api/users/login", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({ username, password }),
     });

     const data = await response.json();

     if (response.ok) {
       // Save token and mark user as logged in
       localStorage.setItem("token", data.token);
       setIsLoggedIn(true);
       navigate("/HomePage");
     } else {
       // Handle login error (e.g., incorrect credentials)
       setError(data.message);
     }
   } catch (error) {
     console.error("Error:", error);
   }
 };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <CreateFormsList setUsername={setUsername} setPassword={setPassword} />
        <div className="d-grid gap-2">
          <button className="btn btn-primary mt-3" type="submit">
            Log in
          </button>
        </div>
      </form>
      <Styles />
    </div>
  );
}

export default ValidateLogin;
