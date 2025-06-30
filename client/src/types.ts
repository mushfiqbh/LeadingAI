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
  participants: string[];
  messages: Message[];
  lastMessage: Message | null;
  userId: string;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  lastLogin?: Date;
  photoURL?: string | null;
  studentId?: string;
  batch?: string;
  section?: string;
  department?: string;
  aboutme?: string;
  conversations?: string[];
  isAdmin?: boolean;
}
