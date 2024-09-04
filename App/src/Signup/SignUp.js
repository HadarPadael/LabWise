// SignUp.js

import React from "react";
import SignUpBar from "./SignUpBar";
import SignUpForm from "./SignUpForm";

function SignUp() {
  return (
    <div>
      <SignUpBar />
      <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUp;
