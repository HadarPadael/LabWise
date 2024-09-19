import React from "react";
import FormItem from "../formItem/FormItem";

function CreateFormsList({ setEmail, setPassword }) {
  const forms = [
    {
      fieldName: "email",
      requestFmt: "email",
      onChange: (e) => setEmail(e.target.value),
    },
    {
      fieldName: "password",
      requestFmt: "password",
      onChange: (e) => setPassword(e.target.value),
    },
  ];

  const formList = forms.map((form, key) => {
    return <FormItem {...form} key={key} />;
  });

  return <div>{formList}</div>;
}

export default CreateFormsList;
