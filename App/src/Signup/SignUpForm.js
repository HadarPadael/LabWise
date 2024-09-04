import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputComponent from "./inputComponent/InputComponent";
import SelectComponent from "./selectComponent/SelectComponent";

function SignUpForm() {
  const [passwordError, setPasswordError] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    reEnterPassword: "",
    nickName: "",
    gender: "",
    month: "",
    day: "",
    year: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData({
      ...formData,
      password: password,
    });

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
    } else {
      setPasswordError("");
    }
  };

  const handlePasswordValidation = (e) => {
    const reEnterPassword = e.target.value;
    setFormData({
      ...formData,
      reEnterPassword: reEnterPassword,
    });

    if (!(reEnterPassword === formData.password)) {
      setPasswordError("Passwords don't match!");
    } else {
      setPasswordError("");
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.nickName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to login page or homepage after successful registration
        navigate("/login");
      } else {
        // Handle error (e.g., show error message to user)
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Create your own LABWISE account!</h2>
      <div
        className="card p-4 shadow 1"
        style={{
          backgroundColor: "#e9f1f7",
          borderRadius: "10px",
          padding: "20px",
          marginBottom: "60px",
        }}
      >
        <form className="row g-3" onSubmit={handleSubmit}>
          <InputComponent
            label="First Name"
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <InputComponent
            label="Last Name"
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          <InputComponent
            label="Enter Email"
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
          />
          <InputComponent
            label="Nickname"
            type="text"
            id="nickName"
            value={formData.nickName}
            onChange={handleChange}
          />
          <InputComponent
            label="New Password"
            type="password"
            id="password"
            value={formData.password}
            onChange={handlePasswordChange}
            passwordError={passwordError}
          />
          <InputComponent
            label="Re-enter password"
            type="password"
            id="reEnterPassword"
            value={formData.reEnterPassword}
            onChange={handlePasswordValidation}
            passwordError={passwordError}
          />
          <div className="col-md-6">
            <SelectComponent
              label="Gender"
              id="gender"
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
              ]}
              value={formData.value}
              onChange={handleChange}
            />
          </div>
          <InputComponent
            label="Add Profile Picture"
            type="file"
            id="profilePicture"
            // value=""
            onChange={handleImageChange}
            accept="image/*"
          />
          <div className="col-12">
            {image && (
              <div>
                <p>Preview:</p>
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </div>
            )}
          </div>
          <div className="col-12">
            <div className="d-grid gap-2 col-3 mx-auto">
              <button
                type="submit"
                data-testid="signup-form"
                className="btn btn-primary btn-lg btn-success"
              >
                Sign Up
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUpForm;
