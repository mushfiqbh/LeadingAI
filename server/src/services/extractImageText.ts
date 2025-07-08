import { tools } from "../mcp/tools";
import openaiClient from "../utils/openaiClient";

const MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-4.1-nano";

export default async function extractImageText(
  image: Express.Multer.File
): Promise<{
  title: string;
  information: string;
} | null> {
  try {
    const base64 = image.buffer.toString("base64");
    const mimeType = image.mimetype;

    const response = await openaiClient.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an OCR assistant. Analyze the image and return all visible text content, along with a suitable short title. Use the defined function to return results.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract all visible text and return a title.",
            },
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${base64}` },
            },
          ],
        },
      ],
      tools,
      tool_choice: {
        type: "function",
        function: { name: "return_notice_text" },
      },
    });

    const toolCall = response.choices[0]?.message?.tool_calls?.[0];
    const args = toolCall?.function?.arguments;

    if (!args) {
      console.error("❌ No tool arguments returned.");
      return null;
    }

    const { title, information } = JSON.parse(args);

    return {
      title: title || "Untitled",
      information: information || "",
    };
  } catch (err: any) {
    console.error("❌ Failed to extract image text:", err.message);
    return null;
  }
}
