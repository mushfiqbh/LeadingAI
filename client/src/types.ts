export interface Message {
  text: string;
  image: File | null;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: Message;
  timestamp: Date;
}
