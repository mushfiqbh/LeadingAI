import openaiClient from "./openaiClient";
import { tools } from "../mcp/tools";
import { ChatCompletionMessageParam } from "openai/resources/index";
import { getResult } from "../mcp/resultMCP";
import { getUnifiedSystemPrompt } from "./systemPrompt";
import { getNotice } from "../mcp/noticeMCP";

const MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-4.1-nano";

export async function* runAgentStream(messages: ChatCompletionMessageParam[]) {
  yield "__thinking__";

  const systemPrompt: ChatCompletionMessageParam = {
    role: "system",
    content: getUnifiedSystemPrompt(),
  };

  const toolCheck = await openaiClient.chat.completions.create({
    model: MODEL,
    messages: [systemPrompt, ...messages],
    tools,
    tool_choice: "auto",
  });

  const choice = toolCheck.choices[0];
  const toolCall = choice?.message?.tool_calls?.[0];

  if (toolCall?.type === "function") {
    yield "__calling_mcp__";

    const args = JSON.parse(toolCall.function.arguments || "{}");

    let mcpResult;
    if (toolCall.function.name === "get_result") {
      mcpResult = await getResult(args.student_id, args.birthday);
    } else if (toolCall.function.name === "get_university_notice") {
      mcpResult = await getNotice();
    }

    const stream = await openaiClient.chat.completions.create({
      model: MODEL,
      messages: [
        systemPrompt,
        ...messages,
        {
          role: "assistant",
          tool_calls: [toolCall],
        },
        {
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify({ result: mcpResult }),
        },
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content;
      if (delta) yield delta;
    }
  } else {
    const stream = await openaiClient.chat.completions.create({
      model: MODEL,
      messages: [systemPrompt, ...messages],
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content;
      if (delta) yield delta;
    }
  }
}
