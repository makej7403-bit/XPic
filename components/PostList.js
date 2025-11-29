"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Image from "next/image";

import Reactions from "./Reactions";
import Comments from "./Comments";

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

    return unsubscribe;
  }, []);

  if (posts.length === 0)
    return <p className="text-center mt-10">No posts yet.</p>;

  return (
    <div className="mt-6 flex flex-col gap-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="p-4 border rounded-md shadow-sm bg-white"
        >
          {/* File preview */}
          {post.url && (
            <div className="relative w-full h-64 bg-gray-200 rounded overflow-hidden">
              <Image
                src={post.url}
                alt="Post"
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Caption */}
          {post.caption && (
            <p className="mt-2 text-gray-800">{post.caption}</p>
          )}

          {/* Reactions (Step A) */}
          <Reactions postId={post.id} />

          {/* Comments */}
          <Comments postId={post.id} />
        </div>
      ))}
    </div>
  );
}
