import { Timestamp } from "firebase/firestore";

export interface ChatMessage {
  text: string;
  image?: File | null;
  imageUrl?: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: ChatMessage;
  timestamp: Date | Timestamp;
  conversationId?: string;
  senderId?: string;
}

export interface Conversation {
  id: string;
  title: string;
  participants: string[];
  messageIds: string[];
  lastMessage: Message | null;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  lastConversation: Conversation | null;
  lastLogin?: Date;
  photoURL?: string | null;
  studentId?: string;
  batch?: string;
  section?: string;
  department?: string;
  aboutme?: string;
  isAdmin?: boolean;
}
