const STORAGE_KEY = "settings-form-data";

const DEFAULT_SETTINGS = {
  displayName: "",
  email: "",
  theme: "system",
  language: "en",
  emailNotifications: true,
  pushNotifications: false,
};

const form = document.getElementById("settings-form");
const statusEl = document.getElementById("form-status");
const resetBtn = document.getElementById("reset-btn");

const fields = {
  displayName: document.getElementById("display-name"),
  email: document.getElementById("email"),
  theme: document.getElementById("theme"),
  language: document.getElementById("language"),
  emailNotifications: document.getElementById("email-notifications"),
  pushNotifications: document.getElementById("push-notifications"),
};

function loadSettings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function populateForm(settings) {
  fields.displayName.value = settings.displayName;
  fields.email.value = settings.email;
  fields.theme.value = settings.theme;
  fields.language.value = settings.language;
  fields.emailNotifications.checked = settings.emailNotifications;
  fields.pushNotifications.checked = settings.pushNotifications;
}

function getFormData() {
  return {
    displayName: fields.displayName.value.trim(),
    email: fields.email.value.trim(),
    theme: fields.theme.value,
    language: fields.language.value,
    emailNotifications: fields.emailNotifications.checked,
    pushNotifications: fields.pushNotifications.checked,
  };
}

function setStatus(message, type = "") {
  statusEl.textContent = message;
  statusEl.className = `form-status${type ? ` ${type}` : ""}`;
}

function clearErrors() {
  fields.displayName.classList.remove("invalid");
  fields.email.classList.remove("invalid");
  document.getElementById("display-name-error").textContent = "";
  document.getElementById("email-error").textContent = "";
}

function validateForm(data) {
  clearErrors();
  let isValid = true;

  if (data.displayName.length < 2) {
    fields.displayName.classList.add("invalid");
    document.getElementById("display-name-error").textContent =
      "Display name must be at least 2 characters.";
    isValid = false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(data.email)) {
    fields.email.classList.add("invalid");
    document.getElementById("email-error").textContent = "Enter a valid email address.";
    isValid = false;
  }

  return isValid;
}

function saveSettings(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = getFormData();

  if (!validateForm(data)) {
    setStatus("Please fix the errors above.", "error");
    return;
  }

  saveSettings(data);
  setStatus("Settings saved successfully.", "success");
});

resetBtn.addEventListener("click", () => {
  populateForm(DEFAULT_SETTINGS);
  clearErrors();
  localStorage.removeItem(STORAGE_KEY);
  setStatus("Settings reset to defaults.", "success");
});

populateForm(loadSettings());
