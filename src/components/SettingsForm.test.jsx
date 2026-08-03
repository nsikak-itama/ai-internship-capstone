import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import SettingsForm from "./SettingsForm.jsx";

describe("SettingsForm", () => {
  it("shows a required name validation message", async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    const nameInput = screen.getByLabelText("Full Name");
    await user.click(nameInput);
    await user.tab();

    expect(screen.getByText("Full name is required.")).toBeInTheDocument();
    expect(nameInput).toHaveAttribute("aria-invalid", "true");
    expect(nameInput).toHaveAttribute("aria-describedby", "fullName-error");
  });

  it("shows a required email validation message", async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    const emailInput = screen.getByLabelText("Email Address");
    await user.click(emailInput);
    await user.tab();

    expect(screen.getByText("Email address is required.")).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("aria-invalid", "true");
    expect(emailInput).toHaveAttribute("aria-describedby", "email-error");
  });

  it("shows an invalid email validation message", async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    const emailInput = screen.getByLabelText("Email Address");
    await user.type(emailInput, "not-an-email");
    await user.tab();

    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("aria-invalid", "true");
    expect(emailInput).toHaveAttribute("aria-describedby", "email-error");
  });

  it("shows a success message after successful submission", async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    await user.type(screen.getByLabelText("Full Name"), "Jane Doe");
    await user.type(screen.getByLabelText("Email Address"), "jane@example.com");

    const saveButton = screen.getByRole("button", { name: "Save" });
    expect(saveButton).toBeEnabled();

    await user.click(saveButton);

    expect(screen.getByText("Settings saved successfully")).toBeInTheDocument();
  });
});
