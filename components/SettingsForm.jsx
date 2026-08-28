"use client";
import { useState } from "react";
import "./SettingsForm.css";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEFAULT_VALUES = {
  fullName: "",
  email: "",
  theme: "system",
};

function validate(values) {
  const errors = {};

  const fullName = values.fullName.trim();
  const email = values.email.trim();

  if (!fullName) {
    errors.fullName = "Full name is required.";
  } else if (fullName.length < 2) {
    errors.fullName = "Full name must be at least 2 characters.";
  }

  if (!email) {
    errors.email = "Email address is required.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  return errors;
}

export default function SettingsForm() {
  const [values, setValues] = useState(DEFAULT_VALUES);
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const errors = validate(values);
  const formValid = Object.keys(errors).length === 0;

  function showError(field) {
    return (touched[field] || submitAttempted) && errors[field];
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSuccessMessage("");
  }

  function handleBlur(event) {
    const { name } = event.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  }

  function handleReset() {
    setValues(DEFAULT_VALUES);
    setTouched({});
    setSubmitAttempted(false);
    setSuccessMessage("");
    setIsSaving(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitAttempted(true);

    if (!formValid) {
      return;
    }

    setIsSaving(true);
    setSuccessMessage("");

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSaving(false);
    setSuccessMessage("Settings saved successfully");
  }

  return (
    <form
      className="settings-form"
      onSubmit={handleSubmit}
      noValidate
      aria-busy={isSaving}
    >
      <div className="field">
        <label htmlFor="fullName">Full Name</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={values.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="name"
          aria-invalid={showError("fullName") ? "true" : "false"}
          aria-describedby={
            showError("fullName") ? "fullName-error" : undefined
          }
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
          autoComplete="email"
          aria-invalid={showError("email") ? "true" : "false"}
          aria-describedby={showError("email") ? "email-error" : undefined}
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
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!formValid || isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          className="btn"
          onClick={handleReset}
          disabled={isSaving}
        >
          Reset
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