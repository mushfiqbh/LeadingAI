import { ChatCompletionMessageParam } from "openai/resources/index";

interface MessageBuilderParams {
  text: string;
  conversationMessages: any[];
  image?: Express.Multer.File;
}

export function buildMessagesWithContext({
  text,
  conversationMessages,
  image,
}: MessageBuilderParams): ChatCompletionMessageParam[] {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are a helpful AI assistant. Today's date is ${new Date().toISOString().split("T")[0]}`,
    },
  ];

  const recentMessages = conversationMessages
    .filter((msg) => msg.content?.text)
    .slice(-10)
    .filter((msg) => !(msg.role === "user" && msg.content.text === text));

  for (const msg of recentMessages) {
    messages.push({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content.text,
    });
  }

  const userMessage: ChatCompletionMessageParam = {
    role: "user",
    content: text,
  };

  if (image) {
    const base64 = image.buffer.toString("base64");
    const mimeType = image.mimetype;

    userMessage.content = [
      { type: "text", text },
      {
        type: "image_url",
        image_url: {
          url: `data:${mimeType};base64,${base64}`,
        },
      },
    ];
  }

  messages.push(userMessage);
  return messages;
}
