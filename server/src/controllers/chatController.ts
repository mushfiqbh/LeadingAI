import OpenAI from "openai";
import { Request, Response } from "express";
import { ChatCompletionContentPart } from "openai/resources/index";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "<YOUR_SITE_URL>",
    "X-Title": "<YOUR_SITE_NAME>",
  },
});

export const chatController = async (req: Request, res: Response) => {
  const { text } = req.body;
  const image = req.file as Express.Multer.File | undefined;

  const OPENROUTER_MODEL =
    process.env.OPENROUTER_MODEL || "qwen/qwen2.5-vl-32b-instruct:free";

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const content: ChatCompletionContentPart[] = [{ type: "text", text }];

  if (image) {
    const base64 = image.buffer.toString("base64");
    const mimeType = image.mimetype;

    content.push({
      type: "image_url",
      image_url: {
        url: `data:${mimeType};base64,${base64}`, // ✅ embed base64
      },
    });
  }

  try {
    const stream = await openai.chat.completions.create({
      model: OPENROUTER_MODEL,
      messages: [
        {
          role: "user",
          content,
        },
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const message = chunk.choices?.[0]?.delta?.content;
      res.write(`data: ${message}\n\n`);
    }

    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (err) {
    console.error(err);
    res.write(`data: [ERROR]\n\n`);
    res.end();
  }
};
