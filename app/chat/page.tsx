import StreamingChat from "@/components/StreamingChat";

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">
        AI Chat
      </h1>
      <StreamingChat />
    </main>
  );
}