import { Request, Response } from "express";
import { runAgentStream } from "../utils/runAgentStream";
import { ChatCompletionContentPart } from "openai/resources/index";

export const chatController = async (req: Request, res: Response) => {
  const { text } = req.body;
  const image = req.file as Express.Multer.File | undefined;

  const content: ChatCompletionContentPart[] = [{ type: "text", text }];

  if (image) {
    const base64 = image.buffer.toString("base64");
    const mimeType = image.mimetype;
    content.push({
      type: "image_url",
      image_url: {
        url: `data:${mimeType};base64,${base64}`,
      },
    });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    for await (const messageChunk of runAgentStream(content)) {
      res.write(`data: ${messageChunk}\n\n`);
    }
    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (err) {
    console.error(err);
    res.write(`data: [ERROR]\n\n`);
    res.end();
  }
};
