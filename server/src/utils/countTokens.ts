import { encoding_for_model, get_encoding, TiktokenModel } from "tiktoken";
import { ChatCompletionMessageParam } from "openai/resources/index";

export function countTokens(
  messages: ChatCompletionMessageParam[],
  model: TiktokenModel = "gpt-4.1-nano"
): number {
  // gpt-4.1-nano likely uses cl100k_base like other OpenAI-compatible models
  const encoding = encoding_for_model(model) ?? get_encoding("cl100k_base");

  let tokensPerMessage = 3;
  let tokensPerName = 1;
  let totalTokens = 0;

  for (const message of messages) {
    totalTokens += tokensPerMessage;
    for (const [key, value] of Object.entries(message)) {
      totalTokens += encoding.encode(value || "").length;
      if (key === "name") {
        totalTokens += tokensPerName;
      }
    }
  }

  // every reply is primed with <|start|>assistant<|message|>
  totalTokens += 3;
  return totalTokens;
}
