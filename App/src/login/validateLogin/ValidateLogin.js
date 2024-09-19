import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateFormsList from "../createFormList/createFormList";
import Styles from "../../styles/Styles";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"; // Firebase SDK
import app from "../../firebaseConfig";

function ValidateLogin({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Firebase authentication using client-side SDK
      console.log("trying to getAuth");
      const auth = getAuth(app); // Initialize Firebase Auth
      console.log("trying to get user credentials");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("getting token...");
      // Get Firebase ID token
      const token = await userCredential.user.getIdToken();

      console.log("trying to call server");
      // Send the token to the backend for verification and further processing
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send the token in Authorization header
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsLoggedIn(true);
        localStorage.setItem("token", data.token); // Store token if needed
        navigate("/HomePage"); // Redirect to homepage
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      setError("Failed to log in. Check your credentials.");
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <CreateFormsList setEmail={setEmail} setPassword={setPassword} />
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
