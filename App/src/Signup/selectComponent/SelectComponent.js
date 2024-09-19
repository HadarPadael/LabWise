import React from "react";

function SelectComponent({ label, id, options, value, onChange }) {
  return (
    <div>
      <label htmlFor={id} className="form-label" style={{ color: "#0056b3" }}>
        {label}
      </label>
      <select
        className="form-select"
        id={id}
        onChange={onChange}
        value={value}
        required
      >
        <option value="">
          {label}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectComponent;
