function FormItem({ fieldName, requestFmt, onChange}) {
  return (
    <div className="form-group">
      <label>{fieldName}</label>
      <input
        type={fieldName === "password" ? "password" : "text"}
        id={fieldName}
        name={fieldName}
        className="form-control"
        placeholder={requestFmt}
        onChange={onChange}
        required
      />
    </div>
  );
}

export default FormItem;