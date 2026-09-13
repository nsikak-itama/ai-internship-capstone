
import { tool } from "ai";
import { z } from "zod";

const candidateScoreInputSchema = z.object({
  skills: z.string().describe("The candidate's relevant skills."),
  experience: z.string().describe("The candidate's relevant experience."),
  interests: z.string().describe("The candidate's professional interests."),
  goals: z.string().describe("The candidate's career or learning goals."),
});

const candidateScoreOutputSchema = z.object({
  score: z.number().int().min(0).max(100),
  level: z.enum(["strong", "moderate", "developing"]),
  strengths: z.array(z.string()),
  recommendation: z.string(),
});

function getProfileFields(input: z.infer<typeof candidateScoreInputSchema>) {
  return [
    { label: "Skills", value: input.skills },
    { label: "Experience", value: input.experience },
    { label: "Interests", value: input.interests },
    { label: "Goals", value: input.goals },
  ];
}

export const scoreCandidate = tool({
  description:
    "Score how complete the candidate's qualification profile is based on skills, experience, interests, and goals. Use this only when the candidate has provided meaningful information for all four areas. Do not invent missing information.",

  inputSchema: candidateScoreInputSchema,

  execute: async (input) => {
    const fields = getProfileFields(input);
    const completedFields = fields.filter(
      ({ value }) => value.trim().length > 0,
    );

    const score = completedFields.length * 25;

    let level: z.infer<typeof candidateScoreOutputSchema>["level"];

    if (score >= 100) {
      level = "strong";
    } else if (score >= 75) {
      level = "moderate";
    } else {
      level = "developing";
    }

    const strengths = completedFields.map(({ label }) => label);

    const missingFields = fields
      .filter(({ value }) => value.trim().length === 0)
      .map(({ label }) => label);

    const recommendation =
      missingFields.length > 0
        ? `Collect more information about: ${missingFields.join(", ")}.`
        : "The qualification profile contains information across all four areas.";

    return {
      score,
      level,
      strengths,
      recommendation,
    };
  },
});
