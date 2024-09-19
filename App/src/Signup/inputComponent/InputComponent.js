import React from "react";

function InputComponent({
  label,
  type,
  id,
  value,
  onChange,
  accept = "",
  passwordError = "",
}) {
  return (
    <div className="col-md-6">
      <label htmlFor={id} className="form-label" style={{ color: "#0056b3" }}>
        {label}
      </label>
      <input
        type={type}
        className="form-control"
        id={id}
        name={id}
        placeholder={label}
        value={value}
        onChange={onChange}
        accept={accept}
        required
      />
      {passwordError && <p className="text-danger">{passwordError}</p>}
    </div>
  );
}

export default InputComponent;
