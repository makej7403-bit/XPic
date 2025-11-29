"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/app/firebase/firebaseConfig";

export default function PostDetails() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  // Load post data
  const loadPost = async () => {
    const docRef = doc(db, "posts", id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      setPost(snap.data());
    }
    setLoading(false);
  };

  // Load comments live
  const loadComments = () => {
    const commentsRef = collection(db, "posts", id, "comments");
    return onSnapshot(commentsRef, (snapshot) => {
      const arr = [];
      snapshot.forEach((d) => arr.push({ id: d.id, ...d.data() }));
      setComments(arr);
    });
  };

  useEffect(() => {
    loadPost();
    const unsubscribe = loadComments();
    return () => unsubscribe();
  }, [id]);

  const likePost = async () => {
    const postRef = doc(db, "posts", id);
    await updateDoc(postRef, { likes: increment(1) });
  };

  const postComment = async () => {
    if (!newComment.trim()) return;

    const commentsRef = collection(db, "posts", id, "comments");

    await addDoc(commentsRef, {
      text: newComment,
      createdAt: serverTimestamp(),
    });

    setNewComment("");
  };

  if (loading || !post) return <p className="p-4">Loading post...</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-4">
        
        {/* Image */}
        <Image
          src={post.imageUrl}
          width={800}
          height={800}
          alt="post"
          className="rounded-xl"
        />

        {/* Caption */}
        <p className="mt-3 text-gray-700">{post.caption}</p>

        {/* Likes */}
        <button
          onClick={likePost}
          className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          ❤️ Like ({post.likes || 0})
        </button>

        {/* Share */}
        <button
          onClick={() => navigator.share?.({ title: "XPic Post", url: window.location.href })}
          className="ml-3 bg-gray-800 text-white px-3 py-2 rounded-lg"
        >
          🔗 Share
        </button>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-xl shadow-md p-4 mt-6">
        <h2 className="text-xl font-bold mb-2">Comments</h2>

        {comments.length === 0 && <p className="text-gray-500">No comments yet</p>}

        {comments.map((c) => (
          <div key={c.id} className="border-b py-2">
            <p>{c.text}</p>
          </div>
        ))}

        <div className="flex mt-4">
          <input
            type="text"
            placeholder="Write a comment…"
            className="flex-1 border px-3 py-2 rounded-lg"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            onClick={postComment}
            className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
