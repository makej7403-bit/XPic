"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function DetailedPost({ postId }) {
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch post live updates
  useEffect(() => {
    if (!postId) return;

    const unsubscribe = onSnapshot(doc(db, "posts", postId), (snap) => {
      if (snap.exists()) {
        setPost({ id: snap.id, ...snap.data() });
      }
    });

    return () => unsubscribe();
  }, [postId]);

  async function handleLike() {
    const ref = doc(db, "posts", postId);
    await updateDoc(ref, {
      likes: arrayUnion("like"), // simple count
    });
  }

  async function submitComment(e) {
    e.preventDefault();
    if (comment.trim() === "") return;

    setLoading(true);
    try {
      await addDoc(collection(db, "posts", postId, "comments"), {
        text: comment,
        createdAt: serverTimestamp(),
      });

      setComment("");
    } catch (err) {
      console.error(err);
      alert("Failed to send comment");
    }
    setLoading(false);
  }

  if (!post) return <p className="p-4">Loading post...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white border rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-500 mb-4">By {post.author}</p>

      {post.downloadURL && (
        <div className="mb-4">
          <img
            src={post.downloadURL}
            alt="Post content"
            className="rounded-lg w-full"
          />
        </div>
      )}

      <p className="mb-4">{post.content}</p>

      {/* Likes */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={handleLike}
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          ❤️ Like
        </button>

        <span className="text-gray-600">
          {post.likes ? post.likes.length : 0} likes
        </span>
      </div>

      {/* Comments */}
      <h2 className="text-lg font-semibold mb-2">Comments</h2>

      <CommentList postId={postId} />

      {/* Add comment */}
      <form onSubmit={submitComment} className="mt-4 flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded"
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}

// -------------------------------
// COMMENT LIST COMPONENT
// -------------------------------
function CommentList({ postId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const ref = collection(db, "posts", postId, "comments");

    const unsubscribe = onSnapshot(ref, (snap) => {
      setComments(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });

    return () => unsubscribe();
  }, [postId]);

  return (
    <div className="space-y-3">
      {comments.length === 0 && (
        <p classmessage="text-gray-500">No comments yet</p>
      )}

      {comments.map((c) => (
        <div
          key={c.id}
          className="p-3 border rounded-lg bg-gray-50 shadow-sm"
        >
          <p>{c.text}</p>
        </div>
      ))}
    </div>
  );
}
