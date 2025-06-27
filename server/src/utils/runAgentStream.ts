import openai from "./openaiClient";
import callMCPServer from "../mcp/callMCPServer";
import { ChatCompletionContentPart } from "openai/resources/index";
import { tools } from "../mcp/tools";

const MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-4.1-nano";

export async function* runAgentStream(content: ChatCompletionContentPart[]) {
  yield "__thinking__";

  const toolCheck = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: "You're an agent that can use an MCP server if needed.",
      },
      { role: "user", content },
    ],
    tools,
    tool_choice: "auto",
  });

  const choice = toolCheck.choices[0];
  const toolCall = choice?.message?.tool_calls?.[0];

  if (toolCall?.type === "function") {
    yield "__requesting_mcp__"; // Notify frontend to show MCP status

    const args = JSON.parse(toolCall.function.arguments || "{}");
    const { server, input, input2 } = args;

    let mcpResult;
    if (toolCall.function.name === "call_mcp_server") {
      mcpResult = await callMCPServer(server, input);
    } else if (toolCall.function.name === "call_mcp_without_birthdate") {
      mcpResult = await callMCPServer(server, input);
    } else if (toolCall.function.name === "call_mcp_with_birthdate") {
      mcpResult = await callMCPServer(server, input, input2);
    }

    const stream = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: "You're an agent that uses MCP data to answer.",
        },
        { role: "user", content },
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
      messages: [{ role: "user", content }],
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content;
      if (delta) yield delta;
    }
  }
}
