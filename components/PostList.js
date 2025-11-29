"use client";

import { useEffect, useState } from "react";
import { db } from "../firebase/clientApp";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import Image from "next/image";
import ShareButtons from "./ShareButtons";

export default function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(list);
    });

    return () => unsubscribe();
  }, []);

  if (!posts.length) {
    return <p className="text-center mt-6 text-gray-500">No posts yet.</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-4 space-y-6 pb-20">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-lg shadow p-4 border border-gray-200"
        >
          {/* Post Owner */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full" />
            <div>
              <p className="font-semibold">{post.username || "User"}</p>
              <p className="text-xs text-gray-400">
                {post.createdAt?.toDate
                  ? post.createdAt.toDate().toLocaleString()
                  : ""}
              </p>
            </div>
          </div>

          {/* Caption */}
          {post.caption && (
            <p className="mb-3 text-gray-700">{post.caption}</p>
          )}

          {/* Image */}
          {post.imageUrl && (
            <div className="relative w-full h-64 bg-gray-100 rounded overflow-hidden">
              <Image
                src={post.imageUrl}
                alt="Post Image"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          )}

          {/* Likes + Comments */}
          <div className="mt-3 flex items-center justify-between text-sm">
            <p className="text-gray-600">{post.likes || 0} Likes</p>
            <p className="text-gray-600">{post.commentCount || 0} Comments</p>
          </div>

          {/* Sharing */}
          <ShareButtons url={`https://xpic.vercel.app/post/${post.id}`} />
        </div>
      ))}
    </div>
  );
}
