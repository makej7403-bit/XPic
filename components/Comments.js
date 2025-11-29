"use client";

import { useState, useEffect } from "react";
import { db } from "@/firebase/client";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { auth } from "@/firebase/client";

export default function Comments({ postId }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  // Load comments live
  useEffect(() => {
    const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, [postId]);

  // Add comment
  async function handleComment() {
    if (!auth.currentUser) {
      alert("Login required to comment.");
      return;
    }

    if (!comment.trim()) return;

    await addDoc(collection(db, "posts", postId, "comments"), {
      text: comment,
      user: auth.currentUser.email,
      createdAt: Date.now(),
    });

    setComment("");
  }

  return (
    <div style={{ marginTop: "10px", paddingLeft: "10px" }}>
      <h4 style={{ fontWeight: "bold", marginBottom: "6px" }}>Comments</h4>

      {comments.map((c) => (
        <div
          key={c.id}
          style={{
            background: "#f0f0f0",
            padding: "8px",
            borderRadius: "6px",
            marginBottom: "6px",
          }}
        >
          <strong>{c.user}</strong>
          <p style={{ marginTop: "4px" }}>{c.text}</p>
        </div>
      ))}

      {/* Comment Input */}
      <div style={{ display: "flex", marginTop: "10px" }}>
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ddd",
          }}
        />
        <button
          onClick={handleComment}
          style={{
            marginLeft: "6px",
            background: "black",
            color: "white",
            borderRadius: "6px",
            padding: "8px 12px",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
