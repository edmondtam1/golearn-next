import { StreamingTextResponse, LangChainStream, Message } from "ai";
import { ChatAnthropic } from "langchain/chat_models/anthropic";
import { AIMessage, HumanMessage } from "langchain/schema";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const { stream, handlers } = LangChainStream();

  const llm = new ChatAnthropic({
    streaming: true,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  });

  llm
    .call(
      (messages as Message[]).map((m) =>
        m.role == "user"
          ? new HumanMessage(m.content)
          : new AIMessage(m.content)
      ),
      {},
      [handlers]
    )
    .catch(console.error);

  return new StreamingTextResponse(stream);
}
