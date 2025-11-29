// utils/notifications.js
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";

/**
 * sendNotification
 * Writes a notification doc under collection "notifications"
 * Fields:
 *  - toUid: recipient user id
 *  - fromUid: actor user id
 *  - type: "follow" | "like" | "comment" | "reply"
 *  - postId: optional post id
 *  - message: human-friendly text
 *  - read: boolean
 *  - createdAt: timestamp
 */
export async function sendNotification({
  toUid,
  fromUid,
  type,
  postId = null,
  message = "",
}) {
  if (!toUid) return;
  try {
    await addDoc(collection(firestore, "notifications"), {
      toUid,
      fromUid,
      type,
      postId,
      message,
      read: false,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("sendNotification error", err);
  }
}
