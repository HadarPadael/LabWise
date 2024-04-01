import React from "react";
import Styles from "../styles/Styles";

function SignUpBar() {
  return (
    <nav className="bar">
      <Styles />
      <div className="container-fluid d-flex justify-content-center">
        <span
          className="app-name mb-0 h1"
          style={{ fontSize: "42px", color: "#ffffff" }}
        >
          LABWISE
        </span>
      </div>
    </nav>
  );
}

export default SignUpBar;
