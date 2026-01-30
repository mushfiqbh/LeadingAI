import { Timestamp } from "firebase/firestore";

export interface ChatMessage {
  text: string;
  image?: File | null;
  imageUrl?: string;
  filename?: string;
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
  lastMessage: {
    text: string;
    senderId: string;
  };
  deleted?: boolean;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export interface UserProfile {
  uid: string;
  totalCredits: number;
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

export interface Link {
  id: string;
  title: string;
  description?: string;
  url: string;
  createdAt?: Date | Timestamp;
}

export interface ClassSchedule {
  batch: string;
  section: string;
  content: string;
}
//  example of content: [{"day":"Sunday","classes":[{"course":"CSE-1151 STA RAB-304","time":"08:50-10:00AM","slot":1}]

export interface Routine {
  id?: string;
  category: "class-routine" | "exam-routine" | "unset";
  title?: string;
  sheetUrl: string;
  semester?: string;
  department?: string;
  content?: string;
  batch: number;
  section: string;
  timeSlots?: string[];
  schedules?: ClassSchedule[];
  contributor: {
    uid: string;
    name: string;
  };
  createdAt?: Date | Timestamp;
  updatedAt?: Date | Timestamp;  
}
