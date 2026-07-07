import { NextResponse } from "next/server";
import { CHAT_SYSTEM_PROMPT } from "@/lib/chat-prompt";
import { isValidScrollTarget } from "@/lib/chat-sections";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatResponseBody {
  message: string;
  scrollTo: string | null;
  suggestions: string[];
}

function parseAssistantJson(raw: string): ChatResponseBody | null {
  try {
    const parsed = JSON.parse(raw) as Partial<ChatResponseBody>;
    if (typeof parsed.message !== "string") return null;

    const scrollTo =
      typeof parsed.scrollTo === "string" && isValidScrollTarget(parsed.scrollTo)
        ? parsed.scrollTo
        : null;

    const suggestions = Array.isArray(parsed.suggestions)
      ? parsed.suggestions
          .filter((s): s is string => typeof s === "string")
          .slice(0, 3)
      : [];

    return { message: parsed.message.trim(), scrollTo, suggestions };
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Chat is not configured. Add GROQ_API_KEY to .env.local (local) or Vercel Environment Variables (production).",
      },
      { status: 503 }
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const messages = body.messages?.filter(
    (m) =>
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string" &&
      m.content.trim().length > 0
  );

  if (!messages?.length) {
    return NextResponse.json({ error: "No messages provided." }, { status: 400 });
  }

  const trimmed = messages.slice(-10);

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.6,
        max_tokens: 220,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: CHAT_SYSTEM_PROMPT },
          ...trimmed,
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Groq API error:", res.status, errText);
      return NextResponse.json(
        { error: "Assistant is temporarily unavailable." },
        { status: 502 }
      );
    }

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content as string | undefined;

    if (!raw) {
      return NextResponse.json(
        { error: "Empty response from assistant." },
        { status: 502 }
      );
    }

    const parsed = parseAssistantJson(raw);
    if (!parsed) {
      return NextResponse.json({
        message: raw.slice(0, 400),
        scrollTo: null,
        suggestions: [],
      });
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }
}
