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

export default function StreamingChat() {
  const [input, setInput] = useState("");
  const [showJumpToLatest, setShowJumpToLatest] = useState(false);
  const [stoppedMessageId, setStoppedMessageId] = useState<string | null>(
    null
  );

  const {
    messages,
    sendMessage,
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

                    {messageText ? (
                      <MessageContent
                        message={message}
                        renderMarkdown={renderMarkdown}
                      />
                    ) : (
                      <span className="text-sm opacity-60">
                        ...
                      </span>
                    )}
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
                {error?.message ??
                  "Something went wrong while generating a response. Please try again."}
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