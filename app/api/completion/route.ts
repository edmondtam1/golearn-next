import { StreamingTextResponse, LangChainStream, AnthropicStream } from "ai";
import { ChatAnthropic } from "langchain/chat_models/anthropic";
import { AIMessage, HumanMessage } from "langchain/schema";

export const runtime = "edge";

export async function POST(req: Request) {
  console.log("req", req);
  if (!req.body) {
    console.log("No body");
    return new Response("No body", { status: 400 });
  }

  const { prompt } = await req.json();

  const response = await fetch("https://api.anthropic.com/v1/complete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY || "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      prompt: `Human: ${prompt}\n\nAssistant:`,
      model: "claude-v2",
      max_tokens_to_sample: 300,
      temperature: 0.9,
      stream: true,
    }),
  });
  console.log("response", response);
  const stream = AnthropicStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
