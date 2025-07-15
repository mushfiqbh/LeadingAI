import { Timestamp } from "firebase/firestore";

export interface ChatMessage {
  text: string;
  image?: File | null;
  imageUrl?: string;
  uploadStatus?: "pending" | "sent" | "done" | "none" | "error";
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
  lastMessage: Message | null;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export interface UserProfile {
  uid: string;
  credits: number;
  usedCredits: number;
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
  gender?: string;
  religion?: string;
  birthdate?: string;
  isAdmin?: boolean;
}

export interface Notice {
  id: string;
  title: string;
  category: "bus-schedule" | "general";
  imageUrl: string;
  information: string;
  contributor: {
    uid: string;
    name: string;
  };
  expiryDate: string | null;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export interface Routine {
  id?: string;
  category: "class-routine" | "exam-routine" | "unset";
  title?: string;
  sheetUrl: string;
  semester?: string;
  department?: string;
  content?: string;
  contributor: {
    uid: string;
    name: string;
  };
  expiryDate: string | null;
  createdAt?: Date | Timestamp;
  updatedAt?: Date | Timestamp;
}
