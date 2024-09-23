import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateFormsList from "../createFormList/createFormList";
import Styles from "../../styles/Styles";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"; // Firebase SDK
import app from "../../firebaseConfig"; // Import Firebase config

function ValidateLogin({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Function to get and store the token in localStorage
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const auth = getAuth(app);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Get Firebase ID token and refresh it before storing
      const token = await userCredential.user.getIdToken(true);
      localStorage.setItem("firebaseToken", token); // Store token in localStorage

      // Send the token to the backend for verification
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsLoggedIn(true);
        localStorage.setItem("token", data.token); // Store server-side token if needed
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
