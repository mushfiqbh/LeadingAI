import { initializeApp, applicationDefault, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK
let isFirebaseInitialized = false;

const apps = getApps();
if (apps.length === 0) {
  // Firebase Admin SDK initialization

  try {
    // Check if GOOGLE_APPLICATION_CREDENTIALS is set (should be a file path)
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      console.log(
        "📄 Using service account key file:",
        process.env.GOOGLE_APPLICATION_CREDENTIALS
      );

      // applicationDefault() will automatically read from the file path
      initializeApp({
        credential: applicationDefault(),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });

      isFirebaseInitialized = true;
    } else {
      console.error(
        "📋 Please set GOOGLE_APPLICATION_CREDENTIALS to the path of your service account key file"
      );
      throw new Error("Firebase credentials not configured");
    }
  } catch (error) {
    console.error("💥 Failed to initialize Firebase Admin SDK:", error);
    console.error(
      "💡 Check if the service account key file exists at:",
      process.env.GOOGLE_APPLICATION_CREDENTIALS
    );
    throw error;
  }
} else {
  // Firebase Admin SDK already initialized
  isFirebaseInitialized = true;
}

export const adminDb = getFirestore();

export class FirebaseAdminService {
  // Create a new conversation
  static async createConversation(conversationData: any) {
    try {
      const docRef = await adminDb.collection("conversations").add({
        ...conversationData,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error("💥 Error creating conversation:", error);
      throw error;
    }
  }

  // Get a conversation by ID
  static async getConversationById(conversationId: string) {
    try {
      const doc = await adminDb
        .collection("conversations")
        .doc(conversationId)
        .get();
      if (!doc.exists) {
        throw new Error(`Conversation ${conversationId} not found`);
      }
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error("💥 Error getting conversation:", error);
      throw error;
    }
  }

  // Get all messages by conversation ID
  static async getMessagesByConversationId(conversationId: string) {
    try {
      const messagesSnapshot = await adminDb
        .collection("messages")
        .where("conversationId", "==", conversationId)
        .orderBy("timestamp", "asc")
        .get();

      return messagesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("💥 Error getting messages by conversation ID:", error);
      throw error;
    }
  }

  // Create a new message in a conversation
  static async createMessage(messageData: any) {
    try {
      // Adding message to Firebase
      const docRef = await adminDb.collection("messages").add({
        ...messageData,
        timestamp: FieldValue.serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error("💥 Error adding message:", error);
      throw error;
    }
  }

  // Update an existing message by ID (used for streaming updates)
  static async updateMessageById(messageId: string, updateData: any) {
    try {
      await adminDb
        .collection("messages")
        .doc(messageId)
        .update({
          ...updateData, // Avoid overwriting the timestamp (Important for streaming)
        });
      // Message updated
    } catch (error) {
      console.error("💥 Error updating message:", error);
      throw error;
    }
  }

  // Add a message to a conversation's messages array
  static async addMessageToConversation(
    conversationId: string,
    messageId: string
  ) {
    try {
      await adminDb
        .collection("conversations")
        .doc(conversationId)
        .update({
          messageIds: FieldValue.arrayUnion(messageId),
          updatedAt: FieldValue.serverTimestamp(),
        });
      // Added message to conversation
    } catch (error) {
      console.error("💥 Error adding message to conversation:", error);
      throw error;
    }
  }

  // Update the last message of a conversation
  static async updateConversationLastMessage(
    conversationId: string,
    lastMessage: any
  ) {
    try {
      await adminDb.collection("conversations").doc(conversationId).update({
        lastMessage,
        updatedAt: FieldValue.serverTimestamp(),
      });
      // Conversation updated
    } catch (error) {
      console.error("💥 Error updating conversation:", error);
      throw error;
    }
  }

  // Get user profile by user ID
  static async getUserProfile(userId: string) {
    try {
      const doc = await adminDb.collection("users").doc(userId).get();

      if (!doc.exists) {
        throw new Error(`User profile ${userId} not found`);
      }

      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error("💥 Error getting user profile:", error);
      throw error;
    }
  }

  // Update user profile by user ID
  static async updateUserProfile(userId: string, profileData: any) {
    try {
      await adminDb
        .collection("users")
        .doc(userId)
        .update({
          ...profileData,
          updatedAt: FieldValue.serverTimestamp(),
        });

      console.log(`✅ User profile ${userId} updated successfully`);
    } catch (error) {
      console.error("💥 Error updating user profile:", error);
      throw error;
    }
  }

  // create notice in notices collection
  static async createNotice(noticeData: any) {
    try {
      const docRef = await adminDb.collection("notices").add({
        ...noticeData,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error("💥 Error creating notice:", error);
      throw error;
    }
  }

  static async deleteExpiredNotices() {
    try {
      const now = new Date();
      const snapshot = await adminDb
        .collection("notices")
        .where("expiryDate", "<", now)
        .get();

      const batch = adminDb.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log("✅ Expired notices deleted successfully");
    } catch (error) {
      console.error("💥 Error deleting expired notices:", error);
    }
  }

  static async getNoticesInformation(
    category: string = "general"
  ): Promise<string[]> {
    try {
      const now = new Date().toISOString();

      const snapshot = await adminDb
        .collection("notices")
        .select("information")
        .where("category", "==", category)
        .where("expiryDate", ">=", now)
        .orderBy("expiryDate", "asc")
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();

      return snapshot.docs.map((doc) => doc.data().information || "");
    } catch (error) {
      console.error("💥 Error getting notices:", error);
      return [];
    }
  }
}
