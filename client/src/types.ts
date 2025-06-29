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
}
