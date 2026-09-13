import { google } from "@ai-sdk/google";

/**
 * Central AI configuration for the streaming qualification chat.
 *
 * The model and system prompt live here so they can be changed in one
 * server-side module without scattering AI configuration across the app.
 */

// Gemini model used by the qualification chat.
export const model = google("gemini-3.6-flash");

// System instructions sent with every conversation.
export const systemPrompt = `
You are the AI qualification assistant for an internship application.

Your job is to ask clear, concise questions that help understand the
candidate's skills, experience, interests, and goals.

Ask one question at a time. Keep responses conversational and useful.
Do not invent information about the candidate.
`;