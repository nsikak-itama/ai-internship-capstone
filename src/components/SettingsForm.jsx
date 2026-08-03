import { useState } from "react";
import "./SettingsForm.css";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values) {
  const errors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (!values.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  return errors;
}

function isFormValid(values) {
  return Object.keys(validate(values)).length === 0;
}

export default function SettingsForm() {
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    theme: "system",
  });
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const errors = validate(values);
  const formValid = isFormValid(values);

  function showError(field) {
    return (touched[field] || submitAttempted) && errors[field];
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setSuccessMessage("");
  }

  function handleBlur(event) {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitAttempted(true);

    if (!formValid) {
      return;
    }

    setSuccessMessage("Settings saved successfully");
  }

  return (
    <form className="settings-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="fullName">Full Name</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={values.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={showError("fullName") ? "true" : "false"}
          aria-describedby={showError("fullName") ? "fullName-error" : undefined}
          autoComplete="name"
        />
        {showError("fullName") && (
          <p id="fullName-error" className="field-error" role="alert">
            {errors.fullName}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={showError("email") ? "true" : "false"}
          aria-describedby={showError("email") ? "email-error" : undefined}
          autoComplete="email"
        />
        {showError("email") && (
          <p id="email-error" className="field-error" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="theme">Theme</label>
        <select
          id="theme"
          name="theme"
          value={values.theme}
          onChange={handleChange}
        >
          <option value="system">System default</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={!formValid}>
          Save
        </button>
      </div>

      {successMessage && (
        <p className="form-status success" role="status" aria-live="polite">
          {successMessage}
        </p>
      )}
    </form>
  );
}
