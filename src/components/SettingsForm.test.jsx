import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, afterEach } from "vitest";
import SettingsForm from "./SettingsForm.jsx";

afterEach(() => {
  vi.useRealTimers();
});

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

  it("requires the full name to be at least 2 characters", async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    const nameInput = screen.getByLabelText("Full Name");

    await user.type(nameInput, "A");
    await user.tab();

    expect(
      screen.getByText("Full name must be at least 2 characters.")
    ).toBeInTheDocument();

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
    vi.useFakeTimers();

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    render(<SettingsForm />);

    await user.type(screen.getByLabelText("Full Name"), "Jane Doe");
    await user.type(
      screen.getByLabelText("Email Address"),
      "jane@example.com"
    );

    const saveButton = screen.getByRole("button", { name: "Save" });

    expect(saveButton).toBeEnabled();

    await user.click(saveButton);

    expect(
      screen.getByRole("button", { name: "Saving..." })
    ).toBeDisabled();

    await vi.advanceTimersByTimeAsync(1000);

    expect(
      await screen.findByText("Settings saved successfully")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Save" })
    ).toBeEnabled();
  });

  it("resets the form and clears validation and success messages", async () => {
    vi.useFakeTimers();

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    render(<SettingsForm />);

    const nameInput = screen.getByLabelText("Full Name");
    const emailInput = screen.getByLabelText("Email Address");
    const themeSelect = screen.getByLabelText("Theme");

    await user.type(nameInput, "Jane Doe");
    await user.type(emailInput, "jane@example.com");
    await user.selectOptions(themeSelect, "dark");

    await user.click(screen.getByRole("button", { name: "Save" }));

    await vi.advanceTimersByTimeAsync(1000);

    await screen.findByText("Settings saved successfully");

    await user.click(screen.getByRole("button", { name: "Reset" }));

    expect(nameInput).toHaveValue("");
    expect(emailInput).toHaveValue("");
    expect(themeSelect).toHaveValue("system");

    expect(
      screen.queryByText("Settings saved successfully")
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("Full name is required.")
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("Email address is required.")
    ).not.toBeInTheDocument();
  });
});