import { ChatCompletionMessageParam } from "openai/resources/index";

interface MessageBuilderParams {
  text: string;
  conversationMessages: any[];
  image?: Express.Multer.File;
  userProfile: any | null;
}

export function buildMessagesWithContext({
  text,
  conversationMessages,
  image,
  userProfile,
}: MessageBuilderParams): ChatCompletionMessageParam[] {
  let profilePrompt = "";
  if (userProfile) {
    // Filter out excluded fields
    const excludedFields = [
      "uid",
      "photoURL",
      "lastLogin",
      "lastUpdated",
      "createdAt",
      "updatedAt",
      "emailVerified",
      "isAdmin",
      "totalCredits",
      "usedCredits",
    ];
    const profileData = Object.entries(userProfile)
      .filter(([key]) => !excludedFields.includes(key))
      .filter(
        ([, value]) => value !== null && value !== undefined && value !== ""
      )
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");

    if (profileData) {
      profilePrompt += `User Profile: ${profileData}`;
    }
  }

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: profilePrompt,
    },
  ];

  const recentMessages = conversationMessages
    .filter((msg) => msg.content?.text)
    .slice(-10)
    .filter((msg) => !(msg.role === "user" && msg.content.text === text));

  for (const msg of recentMessages) {
    let content = msg.content.text;

    // Truncate assistant messages to prevent excessive token usage
    if (msg.role === "assistant" && content.length > 50) {
      content = content.substring(0, 50) + "... [message truncated]";
    }

    messages.push({
      role: msg.role === "user" ? "user" : "assistant",
      content: content,
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
