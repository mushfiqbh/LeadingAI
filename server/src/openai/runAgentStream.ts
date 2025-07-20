import openaiClient from "./openaiClient";
import { tools } from "../mcp/tools";
import { ChatCompletionMessageParam } from "openai/resources/index";
import { getResult } from "../mcp/resultMCP";
import { getUnifiedSystemPrompt } from "./systemPrompt";
import { getNotice } from "../mcp/noticeMCP";
import { getRoutine } from "../mcp/routineMCP";
import { countTokens } from "../utils/countTokens";
import { TiktokenModel } from "tiktoken";
import { FirebaseAdminService } from "../services/firebaseAdmin";

const MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-4.1-nano";

export async function* runAgentStream(
  userId: string,
  messages: ChatCompletionMessageParam[],
  aiMessageId: string
) {
  yield "__thinking__";

  const systemPrompt: ChatCompletionMessageParam = {
    role: "system",
    content: getUnifiedSystemPrompt(),
  };

  // === Check for tool usage ===
  const toolCheck = await openaiClient.chat.completions.create({
    model: MODEL,
    messages: [systemPrompt, ...messages],
    tools,
    tool_choice: "auto",
  });

  const choice = toolCheck.choices[0];
  const toolCall = choice?.message?.tool_calls?.[0];

  if (toolCall?.type === "function") {
    yield `__calling_${toolCall.function.name}_mcp__`;

    const args = JSON.parse(toolCall.function.arguments || "{}");

    let mcpResult;
    if (toolCall.function.name === "get_result") {
      mcpResult = await getResult(args.student_id, args.birthday);
    } else if (toolCall.function.name === "get_notice") {
      mcpResult = await getNotice(args.category);
    } else if (toolCall.function.name === "get_routine") {
      mcpResult = await getRoutine(
        aiMessageId,
        args.category,
        args.department,
        args.batch,
        args.section
      );
    } else {
      console.warn(`⚠️ Unknown tool called: ${toolCall.function.name}`);
      mcpResult = { error: `Unknown tool: ${toolCall.function.name}` };
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
      if (delta) {
        yield delta;
      }
    }
  } else {
    // === No tool, direct stream ===
    const stream = await openaiClient.chat.completions.create({
      model: MODEL,
      messages: [systemPrompt, ...messages],
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content;
      if (delta) {
        yield delta;
      }
    }
  }

  // === Check token limits ===
  try {
    const totalTokenCount = countTokens(
      [systemPrompt, ...messages],
      "gpt-4.1-nano" as TiktokenModel
    );

    // Update user Credits in Firebase (don't await to avoid blocking stream)
    FirebaseAdminService.updateUserCredits({
      userId,
      usedCredits: Math.round(totalTokenCount / 100), // 1 credit per 100 tokens
    }).catch((error) => {
      console.error("Error updating user Credits:", error);
    });
  } catch (error) {
    console.error("Error counting Credits:", error);
  }
}
