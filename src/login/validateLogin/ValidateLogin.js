import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateFormsList from "../createFormList/createFormList";
import Styles from "../../styles/Styles";

function ValidateLogin({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Hardcoded username and password for demonstration purposes
  const hardcodedUsername = "user";
  const hardcodedPassword = "password";

  const handleSubmit = (event) => {
    event.preventDefault();

    // Check if entered username and password match the hardcoded values
    if (username === hardcodedUsername && password === hardcodedPassword) {
      // Redirect to the feed page if login is successful
      setIsLoggedIn(true);
      navigate("/HomePage");
    } else {
      // Handle incorrect login attempt
      setError("Incorrect username or password");
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
