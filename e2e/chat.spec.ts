import { test, expect } from "@playwright/test";

test("primary chat flow renders a mocked assistant response", async ({
    page,
}) => {
    let chatRequestReceived = false;
    // Intercept the AI request so this test never calls the real API.
    await page.route("**/api/chat", async (route) => {
        chatRequestReceived = true;

        const chunks = [
            { type: "start", messageId: "mock-assistant-1" },
            { type: "text-start", id: "text-1" },
            {
                type: "text-delta",
                id: "text-1",
                delta: "Welcome! Your qualification profile has started.",
            },
            { type: "text-end", id: "text-1" },
            { type: "finish" },
        ];

        const body =
            chunks.map((chunk) => `data: ${JSON.stringify(chunk)}\n\n`).join("") +
            "data: [DONE]\n\n";

        await route.fulfill({
            status: 200,
            contentType: "text/event-stream",
            headers: {
                "x-vercel-ai-ui-message-stream": "v1",
            },
            body,
        });
    });

    await page.goto("/chat");

    await expect(
        page.getByRole("heading", { name: "AI Qualification Chat" }),
    ).toBeVisible();

    await expect(
        page.getByText("Start your qualification profile"),
    ).toBeVisible();

    const messageInput = page.getByRole("textbox", { name: "Message" });

    await messageInput.fill("Tell me about the qualification process.");

    await messageInput.press("Enter");

    await expect
        .poll(() => chatRequestReceived, { timeout: 5000 })
        .toBe(true);

    await expect(
        page.getByText("Tell me about the qualification process."),
    ).toBeVisible();

    await expect(
        page.getByText("Welcome! Your qualification profile has started."),
    ).toBeVisible();
});