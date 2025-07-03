import openai from "./openaiClient";
import { tools } from "../mcp/tools";
import { ChatCompletionMessageParam } from "openai/resources/index";
import { getResult } from "../mcp/resultMCP";

const MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-4.1-nano";

export async function* runAgentStream(messages: ChatCompletionMessageParam[]) {
  yield "__thinking__";

  const systemPrompt: ChatCompletionMessageParam = {
    role: "system",
    content: `
You are an assistant that helps users retrieve their academic results.
- Always collect the student_id first.
- If the user only gives their student ID, call 'get_result' with just the ID to show a partial result.
- Then offer: "If you want your full result, please provide your birthday (YYYY-MM-DD)."
- If the user provides both student ID and birthday, call 'get_result' with both to return the full result.
Ask clearly for missing info if needed.
`,
  };

  const toolCheck = await openai.chat.completions.create({
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
    }

    const stream = await openai.chat.completions.create({
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
    const stream = await openai.chat.completions.create({
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
