import openai from "./openaiClient";
import callMCPServer from "./callMCPServer";
import { ChatCompletionContentPart } from "openai/resources/index";

const MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-4o";

export async function* runAgentStream(content: ChatCompletionContentPart[]) {
  // Step 1: Check if tool is needed
  const toolCheck = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: "You're an agent that can use an MCP server if needed.",
      },
      { role: "user", content },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "call_mcp_server",
          description: "Call an MCP server with given input",
          parameters: {
            type: "object",
            properties: {
              server: { type: "string" },
              input: { type: "string" },
            },
            required: ["server", "input"],
          },
        },
      },
    ],
    tool_choice: "auto",
  });

  const choice = toolCheck.choices[0];

  // Step 2: Check if tool call occurred
  const toolCall = choice?.message?.tool_calls?.[0];

  if (toolCall?.function?.name === "call_mcp_server") {
    const args = JSON.parse(toolCall.function.arguments || "{}");

    const mcpResult = await callMCPServer(args.server, args.input);

    // Step 3: Feed result back into AI for final streaming
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
    // No tool needed — stream direct response
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
