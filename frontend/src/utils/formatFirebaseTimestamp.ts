import { Timestamp } from "firebase/firestore";

export const formatTime = (timestamp: Date | Timestamp | null | undefined) => {
  if (!timestamp) {
    return "Now";
  }

  try {
    // Handle Firestore Timestamp objects
    let date: Date;
    if (timestamp && typeof timestamp === "object" && "toDate" in timestamp) {
      // It's a Firestore Timestamp
      date = (timestamp as Timestamp).toDate();
    } else if (timestamp instanceof Date) {
      // It's already a Date object
      date = timestamp;
    } else {
      // Try to create a Date from the value
      date = new Date(timestamp as string | number);
    }

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Now";
    }

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return "Now";
  }
};

export const formatDate = (timestamp: Date | Timestamp | null | undefined) => {
  if (!timestamp) {
    return "Today";
  }

  try {
    // Handle Firestore Timestamp objects
    let date: Date;
    if (timestamp && typeof timestamp === "object" && "toDate" in timestamp) {
      // It's a Firestore Timestamp
      date = (timestamp as Timestamp).toDate();
    } else if (timestamp instanceof Date) {
      // It's already a Date object
      date = timestamp;
    } else {
      // Try to create a Date from the value
      date = new Date(timestamp as string | number);
    }

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Today";
    }

    return date.toLocaleDateString();
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return "Today";
  }
};
