// components/CommentList.jsx
"use client";

import { useEffect, useState } from "react";
import { auth, firestore } from "@/firebase/clientApp";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { sendNotification } from "@/utils/notifications";

/**
 * CommentList
 * props:
 *  - postId
 */
export default function CommentList({ postId }) {
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!postId) return;
    const q = query(
      collection(firestore, "posts", postId, "comments"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) =>
      setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    return () => unsub();
  }, [postId]);

  const handleSend = async () => {
    if (!user) return alert("Sign in to comment.");
    if (!text.trim()) return;

    setSending(true);
    try {
      await addDoc(collection(firestore, "posts", postId, "comments"), {
        text: text.trim(),
        authorUid: user.uid,
        authorName: user.displayName || user.email,
        createdAt: serverTimestamp(),
      });

      // send notification to post owner
      // we need post owner id — quick fetch doc
      const postSnap = await import("firebase/firestore").then(({ getDoc, doc }) =>
        getDoc(doc(firestore, "posts", postId))
      );
      const postData = postSnap?.data?.() ? postSnap.data() : null;
      if (postData && postData.ownerUid && postData.ownerUid !== user.uid) {
        await sendNotification({
          toUid: postData.ownerUid,
          fromUid: user.uid,
          type: "comment",
          postId,
          message: `${user.displayName || user.email} commented: ${text.trim().slice(0, 80)}`,
        });
      }

      setText("");
    } catch (err) {
      console.error("send comment error", err);
      alert("Failed to send comment.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Comments</h4>

      <div className="space-y-2">
        {comments.map((c) => (
          <div key={c.id} className="p-2 bg-gray-100 rounded">
            <div className="text-sm font-semibold">{c.authorName || "User"}</div>
            <div className="text-sm">{c.text}</div>
            <div className="text-xs text-gray-400 mt-1">
              {c.createdAt?.toDate ? c.createdAt.toDate().toLocaleString() : ""}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={handleSend}
          disabled={sending}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
