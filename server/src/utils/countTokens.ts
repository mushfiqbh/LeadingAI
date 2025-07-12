import { encode } from "gpt-3-encoder";
import { ChatCompletionMessageParam } from "openai/resources/index";

export default function countTokens(
  input: string | ChatCompletionMessageParam[]
) {
  if (typeof input === "string") {
    return encode(input).length;
  }
  // if it's an array of messages
  return input.reduce((sum, msg) => {
    let content: string = "";
    if (typeof msg.content === "string") {
      content = msg.content;
    } else if (Array.isArray(msg.content)) {
      // Join all text parts if content is an array
      content = msg.content
        .map((part: any) => (typeof part === "string" ? part : part.text || ""))
        .join("");
    }
    return sum + encode(content).length;
  }, 0);
}
