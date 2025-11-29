"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import Comments from "./Comments";

export default function PostList() {
  const [posts, setPosts] = useState([]);

  // Load posts live from Firestore
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

  return (
    <div style={{ marginTop: "30px" }}>
      <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "15px" }}>
        Latest Uploads
      </h2>

      {posts.length === 0 && <p>No posts yet.</p>}

      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            background: "white",
            padding: "15px",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            marginBottom: "25px",
          }}
        >
          {/* Title */}
          <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>{post.title}</h3>

          {/* Image or file URL */}
          {post.fileUrl && (
            <img
              src={post.fileUrl}
              alt="uploaded file"
              style={{
                width: "100%",
                borderRadius: "10px",
                marginBottom: "10px",
                background: "#eee",
              }}
            />
          )}

          {/* Description */}
          {post.description && (
            <p style={{ marginTop: "8px", marginBottom: "10px" }}>
              {post.description}
            </p>
          )}

          {/* COMMENTS SECTION */}
          <Comments postId={post.id} />
        </div>
      ))}
    </div>
  );
}
