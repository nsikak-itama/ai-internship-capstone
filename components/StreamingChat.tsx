"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactMarkdown from "react-markdown";

import {
  DefaultChatTransport,
  type UIMessage,
} from "ai";

import { useChat } from "@ai-sdk/react";

 function getMessageText(message: UIMessage) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

function MessageContent({
  message,
  renderMarkdown,
}: {
  message: UIMessage;
  renderMarkdown: boolean;
}) {
  const text = getMessageText(message);

  if (!renderMarkdown) {
    return (
      <p className="whitespace-pre-wrap break-words">
        {text}
      </p>
    );
  }

  return (
    <div className="prose prose-sm max-w-none break-words">
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
}


type ScoreCandidateToolPartData = {
  type: "tool-scoreCandidate";
  toolCallId: string;
  state:
    | "input-streaming"
    | "input-available"
    | "output-available"
    | "output-error";
  input?: unknown;
  output?: unknown;
  errorText?: string;
};

function ScoreCandidateToolPart({
  part,
}: {
  part: ScoreCandidateToolPartData;
}) {
  if (part.state === "input-streaming") {
    return (
      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-blue-900">
        <p className="text-sm font-semibold">
          Preparing candidate score
        </p>

        <p className="mt-1 text-sm text-blue-700">
          Gathering the qualification information...
        </p>

        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-blue-100"
          aria-hidden="true"
        >
          <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-500" />
        </div>
      </div>
    );
  }

  if (part.state === "input-available") {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
        <p className="text-sm font-semibold text-gray-900">
          Candidate information received
        </p>

        <p className="mt-1 text-sm text-gray-600">
          The qualification profile is being scored.
        </p>
      </div>
    );
  }

  if (part.state === "output-error") {
    return (
      <div
        role="alert"
        className="rounded-xl border border-red-200 bg-red-50 px-4 py-3"
      >
        <p className="text-sm font-semibold text-red-900">
          Candidate score unavailable
        </p>

        <p className="mt-1 text-sm text-red-700">
          {part.errorText ?? "The scoring tool could not complete."}
        </p>
      </div>
    );
  }

  if (part.state === "output-available") {
    const output = part.output;

    if (
      typeof output !== "object" ||
      output === null ||
      !("score" in output) ||
      !("level" in output) ||
      !("strengths" in output) ||
      !("recommendation" in output) ||
      typeof output.score !== "number" ||
      typeof output.level !== "string" ||
      !Array.isArray(output.strengths) ||
      !output.strengths.every(
        (strength): strength is string =>
          typeof strength === "string",
      ) ||
      typeof output.recommendation !== "string"
    ) {
      return (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3"
        >
          <p className="text-sm font-semibold text-red-900">
            Candidate score unavailable
          </p>

          <p className="mt-1 text-sm text-red-700">
            The tool returned an unexpected result.
          </p>
        </div>
      );
    }

    const score = output.score;
    const level = output.level;
    const strengths = output.strengths;
    const recommendation = output.recommendation;

    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Qualification score
            </p>

            <p className="mt-1 text-sm font-medium capitalize text-gray-900">
              {level} profile
            </p>
          </div>

          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">
              {score}
            </p>

            <p className="text-xs text-gray-500">
              out of 100
            </p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm font-semibold text-gray-900">
            Strengths identified
          </p>

          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {strengths.map((strength) => (
              <li
                key={strength}
                className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700"
              >
                {strength}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 border-t border-gray-100 pt-4">
          <p className="text-sm font-semibold text-gray-900">
            Recommendation
          </p>

          <p className="mt-1 text-sm text-gray-600">
            {recommendation}
          </p>
        </div>
      </div>
    );
  }

  return null;
}



export default function StreamingChat() {
  const [input, setInput] = useState("");
  const [showJumpToLatest, setShowJumpToLatest] = useState(false);
  const [stoppedMessageId, setStoppedMessageId] = useState<string | null>(
    null
  );

  const {
    messages,
    sendMessage,
    regenerate,
    status,
    stop,
    error,
  } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);

  const isGenerating =
    status === "submitted" || status === "streaming";

  const latestAssistantMessage = [...messages]
    .reverse()
    .find((message) => message.role === "assistant");

  const latestAssistantText = latestAssistantMessage
    ? getMessageText(latestAssistantMessage)
    : "";

  const showThinkingIndicator =
    status === "submitted" ||
    (status === "streaming" && latestAssistantText.length === 0);

  const scrollToLatest = (behavior: ScrollBehavior = "smooth") => {
    const container = messagesContainerRef.current;

    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });

    isAtBottomRef.current = true;
    setShowJumpToLatest(false);
  };

  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container) {
      return;
    }

    const handleScroll = () => {
      const distanceFromBottom =
        container.scrollHeight -
        container.scrollTop -
        container.clientHeight;

      const atBottom = distanceFromBottom <= 24;

      isAtBottomRef.current = atBottom;
      setShowJumpToLatest(!atBottom);
    };

    handleScroll();

    container.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isAtBottomRef.current) {
      scrollToLatest("auto");
    }
  }, [messages]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedInput = input.trim();

    if (!trimmedInput || isGenerating) {
      return;
    }

    setStoppedMessageId(null);
    sendMessage({ text: trimmedInput });
    setInput("");
  };

  const handleStop = () => {
    if (latestAssistantMessage) {
      setStoppedMessageId(latestAssistantMessage.id);
    }

    stop();
  };

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
        <h2 className="text-lg font-semibold text-gray-900">
          AI Qualification Chat
        </h2>

        <p className="mt-1 text-sm text-gray-600">
          Answer a few questions so the assistant can learn about your
          background and internship goals.
        </p>
      </div>

      <div className="relative">
        <div
          ref={messagesContainerRef}
          className="h-[55vh] min-h-[320px] overflow-y-auto px-4 py-5 sm:px-6"
          aria-live="polite"
          aria-label="Conversation"
        >
          <div className="flex flex-col gap-5">
            {messages.map((message) => {
              const isUser = message.role === "user";
              const messageText = getMessageText(message);

              const isStreamingMessage =
                message.role === "assistant" &&
                isGenerating &&
                message.id === latestAssistantMessage?.id;

              const wasStopped =
                message.id === stoppedMessageId;

              const renderMarkdown =
                message.role === "assistant" &&
                !isStreamingMessage &&
                !wasStopped;

              return (
                <div
                  key={message.id}
                  className={`flex ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 sm:max-w-[78%] ${
                      isUser
                        ? "rounded-br-md bg-gray-900 text-white"
                        : "rounded-bl-md bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-70">
                      {isUser ? "You" : "Assistant"}
                    </p>

                    {message.parts.map((part, index) => {if (part.type === "text") {
    return part.text ? (
      <MessageContent
        key={`${message.id}-text-${index}`}
        message={message}
        renderMarkdown={renderMarkdown}
      />
    ) : null;
  }

  if (part.type === "tool-scoreCandidate") {
    return (
     <ScoreCandidateToolPart
      key={part.toolCallId}
      part={part as unknown as ScoreCandidateToolPartData}
     />
    );
  }

  return null;
})}
                  </div>
                </div>
              );
            })}

            {showThinkingIndicator && (
              <div className="flex justify-start">
                <div
                  className="max-w-[88%] rounded-2xl rounded-bl-md bg-gray-100 px-4 py-3 text-gray-900 sm:max-w-[78%]"
                  aria-live="polite"
                >
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-70">
                    Assistant
                  </p>

                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 animate-pulse rounded-full bg-gray-400"
                      aria-hidden="true"
                    />
                    <span
                      className="h-2 w-2 animate-pulse rounded-full bg-gray-400 [animation-delay:150ms]"
                      aria-hidden="true"
                    />
                    <span
                      className="h-2 w-2 animate-pulse rounded-full bg-gray-400 [animation-delay:300ms]"
                      aria-hidden="true"
                    />

                    <span className="sr-only">
                      Assistant is thinking
                    </span>
                  </div>
                </div>
              </div>
            )}

            {status === "error" && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              >
                <p className="font-semibold">
                  Something went wrong while generating a response
                </p>
                <p className="mt-1">
                {error?.message ??
                  "Something went wrong while generating a response. Please try again."}
                </p>
                <button
                type="button"
                onClick={() => regenerate()}
                className="mt-3 rounded-lg bg-red-800 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-800 focus:ring-offset-2"
                >
                 Try again
                </button>
              </div>
            )}
          </div>
        </div>

        {showJumpToLatest && (
          <button
            type="button"
            onClick={() => scrollToLatest()}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-md transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            Jump to latest
          </button>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-200 bg-gray-50 p-3 sm:p-4"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <label htmlFor="chat-input" className="sr-only">
            Message
          </label>

          <textarea
            id="chat-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey
              ) {
                event.preventDefault();

                if (input.trim() && !isGenerating) {
                  event.currentTarget.form?.requestSubmit();
                }
              }
            }}
            disabled={isGenerating}
            rows={3}
            placeholder="Ask a question..."
            className="min-h-12 flex-1 resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 disabled:cursor-not-allowed disabled:bg-gray-100"
          />

          {isGenerating ? (
            <button
              type="button"
              onClick={handleStop}
              className="min-h-12 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="min-h-12 rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Send
            </button>
          )}
        </div>

        <p className="mt-2 text-xs text-gray-500">
          Press Enter to send. Use Shift + Enter for a new line.
        </p>
      </form>
    </section>
  );
}
