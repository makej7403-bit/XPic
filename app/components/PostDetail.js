"use client";
import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function PostDetail({ postId, onBack }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;

    async function fetchPost() {
      try {
        const docRef = doc(db, "posts", postId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        } else {
          setPost(null);
        }
      } catch (error) {
        console.error("Error loading post:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [postId]);

  if (loading) return <p className="text-gray-600 text-center">Loading...</p>;
  if (!post) return <p className="text-red-600 text-center">Post not found.</p>;

  return (
    <div className="border p-5 rounded-lg shadow-md bg-white">
      <button
        onClick={onBack}
        className="mb-4 px-3 py-2 bg-gray-700 text-white rounded"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-2">{post.title}</h2>

      <p className="text-gray-600 mb-3">
        By <span className="font-semibold">{post.author}</span>
      </p>

      <p className="text-gray-800 whitespace-pre-line">{post.content}</p>

      {post.downloadURL && (
        <a
          href={post.downloadURL}
          target="_blank"
          className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded"
        >
          📎 Download Attachment
        </a>
      )}
    </div>
  );
}
