import { convertToModelMessages, streamText, type UIMessage } from "ai";

import { model, systemPrompt } from "@/lib/ai/config";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model,
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}