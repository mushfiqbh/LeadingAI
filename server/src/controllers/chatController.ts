import OpenAI from "openai";
import { Request, Response } from "express";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "<YOUR_SITE_URL>",
    "X-Title": "<YOUR_SITE_NAME>",
  },
});

export const chatController = async (req: Request, res: Response) => {
  const content = req.body;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const stream = await openai.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash-exp:free",
      messages: [{ role: "user", content }],
      stream: true,
    });

    for await (const chunk of stream) {
      const message = chunk.choices?.[0]?.delta?.content;
      if (message) {
        res.write(`data: ${message}\n\n`);
      }
    }

    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (err) {
    console.error(err);
    res.write(`data: [ERROR]\n\n`);
    res.end();
  }
};
