import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@ai-sdk/react", () => ({
  useChat: vi.fn(),
}));

vi.mock("ai", () => ({
  DefaultChatTransport: vi.fn().mockImplementation(() => ({})),
}));

import { useChat } from "@ai-sdk/react";
import StreamingChat from "../../components/StreamingChat";

const mockUseChat = vi.mocked(useChat);

beforeEach(() => {
  mockUseChat.mockReset();
});

describe("StreamingChat", () => {
  it("shows the thinking state while a response is being submitted", () => {
    mockUseChat.mockReturnValue({
      messages: [],
      sendMessage: vi.fn(),
      regenerate: vi.fn(),
      status: "submitted",
      stop: vi.fn(),
      error: undefined,
    } as any);

    render(<StreamingChat />);

    expect(screen.getByText("Assistant is thinking")).toBeInTheDocument();
    expect(screen.getByLabelText("Message")).toBeDisabled();
  });

  it("renders the assistant text while a response is streaming", () => {
    mockUseChat.mockReturnValue({
      messages: [
        {
          id: "assistant-1",
          role: "assistant",
          parts: [
            {
              type: "text",
              text: "I am reviewing your qualification profile.",
            },
          ],
        },
      ],
      sendMessage: vi.fn(),
      regenerate: vi.fn(),
      status: "streaming",
      stop: vi.fn(),
      error: undefined,
    } as any);

    render(<StreamingChat />);

    expect(
      screen.getByText("I am reviewing your qualification profile."),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Message")).toBeDisabled();
  });

  it("shows the error state when response generation fails", () => {
    const regenerate = vi.fn();

    mockUseChat.mockReturnValue({
      messages: [],
      sendMessage: vi.fn(),
      regenerate,
      status: "error",
      stop: vi.fn(),
      error: {
        message: "Network failed",
      },
    } as any);

    render(<StreamingChat />);

    expect(
      screen.getByText("The response couldn't be completed"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "The connection was interrupted or the server returned an error. Please try again.",
      ),
    ).toBeInTheDocument();

    const retryButton = screen.getByRole("button", {
      name: "Try again",
    });

    expect(retryButton).toBeInTheDocument();

    retryButton.click();

    expect(regenerate).toHaveBeenCalledTimes(1);
  });

  it("shows the candidate score loading state while the tool input is streaming", () => {
    mockUseChat.mockReturnValue({
      messages: [
        {
          id: "assistant-tool-1",
          role: "assistant",
          parts: [
            {
              type: "tool-scoreCandidate",
              state: "input-streaming",
              input: {},
            },
          ],
        },
      ],
      sendMessage: vi.fn(),
      regenerate: vi.fn(),
      status: "streaming",
      stop: vi.fn(),
      error: undefined,
    } as any);

    render(<StreamingChat />);

    expect(screen.getByText("Preparing candidate score")).toBeInTheDocument();

    expect(
      screen.getByText("Gathering the qualification information..."),
    ).toBeInTheDocument();
  });

  it("shows the candidate information state when tool input is available", () => {
    mockUseChat.mockReturnValue({
      messages: [
        {
          id: "assistant-tool-2",
          role: "assistant",
          parts: [
            {
              type: "tool-scoreCandidate",
              state: "input-available",
              input: {
                skills: "UI/UX design",
                experience: "2 years",
                interests: "Product design",
                goals: "Build better digital products",
              },
            },
          ],
        },
      ],
      sendMessage: vi.fn(),
      regenerate: vi.fn(),
      status: "streaming",
      stop: vi.fn(),
      error: undefined,
    } as any);

    render(<StreamingChat />);

    expect(
      screen.getByText("Candidate information received"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("The qualification profile is being scored."),
    ).toBeInTheDocument();
  });

  it("renders a completed candidate score from the tool result", () => {
    mockUseChat.mockReturnValue({
      messages: [
        {
          id: "assistant-tool-3",
          role: "assistant",
          parts: [
            {
              type: "tool-scoreCandidate",
              state: "output-available",
              input: {
                skills: "UI/UX design",
                experience: "2 years",
                interests: "Product design",
                goals: "Build better digital products",
              },
              output: {
                score: 100,
                level: "strong",
                strengths: [
                  "UI/UX design",
                  "2 years of experience",
                  "Product design interests",
                ],
                recommendation:
                  "This candidate has a complete qualification profile.",
              },
            },
          ],
        },
      ],
      sendMessage: vi.fn(),
      regenerate: vi.fn(),
      status: "streaming",
      stop: vi.fn(),
      error: undefined,
    } as any);

    render(<StreamingChat />);

    expect(screen.getByText("Qualification score")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("strong profile")).toBeInTheDocument();

    expect(screen.getByText("UI/UX design")).toBeInTheDocument();
    expect(screen.getByText("2 years of experience")).toBeInTheDocument();
    expect(screen.getByText("Product design interests")).toBeInTheDocument();

    expect(
      screen.getByText("This candidate has a complete qualification profile."),
    ).toBeInTheDocument();
  });

  it("shows an error when the candidate score tool fails", () => {
    mockUseChat.mockReturnValue({
      messages: [
        {
          id: "assistant-tool-4",
          role: "assistant",
          parts: [
            {
              type: "tool-scoreCandidate",
              state: "output-error",
              errorText: "The scoring service is unavailable.",
            },
          ],
        },
      ],
      sendMessage: vi.fn(),
      regenerate: vi.fn(),
      status: "streaming",
      stop: vi.fn(),
      error: undefined,
    } as any);

    render(<StreamingChat />);

    expect(screen.getByText("Candidate score unavailable")).toBeInTheDocument();

    expect(
      screen.getByText("The scoring service is unavailable."),
    ).toBeInTheDocument();
  });
});
