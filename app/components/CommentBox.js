"use client";
import { useState, useEffect } from "react";
import { db } from "@/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

export default function CommentBox({ postId, user }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub();
  }, [postId]);

  const sendComment = async () => {
    if (!comment.trim()) return;

    await addDoc(collection(db, "posts", postId, "comments"), {
      text: comment,
      user: user?.email,
      createdAt: serverTimestamp(),
    });

    setComment("");
  };

  return (
    <div className="mt-3 border-t pt-3">
      <h3 className="font-semibold">Comments</h3>

      {/* comment list */}
      <div className="mt-2 space-y-2">
        {comments.map(c => (
          <div key={c.id} className="bg-gray-100 p-2 rounded">
            <p className="text-sm"><b>{c.user}:</b> {c.text}</p>
          </div>
        ))}
      </div>

      {/* comment input */}
      <div className="flex mt-3">
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="flex-1 border px-3 py-2 rounded"
          placeholder="Write a comment..."
        />
        <button
          onClick={sendComment}
          className="ml-2 bg-blue-500 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
