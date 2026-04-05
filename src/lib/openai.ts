import { Message } from "./gemini";

export async function* streamOpenAI(messages: Message[]) {
  try {
    const response = await fetch("/api/openai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages.map(m => ({
          role: m.role === "model" ? "assistant" : "user",
          content: m.content
        })),
        model: "gpt-4o"
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch from OpenAI proxy");
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Simulate streaming for UI consistency if needed, 
    // but the proxy currently returns the full response.
    // Let's just yield the whole thing at once for now.
    yield content;
  } catch (error: any) {
    console.error("OpenAI Stream Error:", error);
    throw error;
  }
}
