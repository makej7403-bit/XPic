"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/firebase/client";
import {
  doc,
  updateDoc,
  onSnapshot,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

export default function Reactions({ postId }) {
  const user = auth.currentUser;
  const [post, setPost] = useState(null);

  const emojiList = ["❤️", "🔥", "😂", "👍"];

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "posts", postId), (snap) => {
      setPost(snap.data());
    });

    return unsub;
  }, [postId]);

  if (!post) return null;

  const toggleReaction = async (emoji) => {
    if (!user) return alert("Login first!");

    const userId = user.uid;
    const rx = post.reactions || {};

    // Ensure reaction list exists
    if (!rx[emoji]) rx[emoji] = [];

    // If user already reacted → remove
    const already = rx[emoji].includes(userId);

    const ref = doc(db, "posts", postId);

    if (already) {
      await updateDoc(ref, {
        [`reactions.${emoji}`]: arrayRemove(userId),
      });
    } else {
      await updateDoc(ref, {
        [`reactions.${emoji}`]: arrayUnion(userId),
      });
    }
  };

  return (
    <div style={{ marginTop: "10px", marginBottom: "10px" }}>
      <div style={{ display: "flex", gap: "10px" }}>
        {emojiList.map((em) => (
          <button
            key={em}
            onClick={() => toggleReaction(em)}
            style={{
              fontSize: "22px",
              background: "#eee",
              padding: "6px 12px",
              borderRadius: "8px",
            }}
          >
            {em} {post.reactions?.[em]?.length || 0}
          </button>
        ))}
      </div>
    </div>
  );
}
