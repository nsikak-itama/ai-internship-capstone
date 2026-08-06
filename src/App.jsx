import SettingsForm from "./components/SettingsForm.jsx";

export default function App() {
  return (
    <main className="page">
      <header className="page-header">
        <h1>Settings</h1>
        <p className="page-subtitle">Manage your profile and preferences.</p>
      </header>
      <SettingsForm />
    </main>
  );
}
