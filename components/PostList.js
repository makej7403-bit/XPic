"use client";
import { db } from "@/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <div>
      {posts.map((p) => (
        <div key={p.id} style={{ border: "1px solid #ccc", margin: "20px" }}>
          <p>{p.caption}</p>

          {/* Auto-detect file type */}
          {p.fileType.startsWith("image") && (
            <img src={p.fileURL} width="300" />
          )}

          {p.fileType === "application/pdf" && (
            <a href={p.fileURL} target="_blank">Open PDF</a>
          )}

          {p.fileType.startsWith("audio") && (
            <audio controls src={p.fileURL}></audio>
          )}

          {p.fileType.startsWith("video") && (
            <video controls width="300" src={p.fileURL}></video>
          )}

          <small>Posted by: {p.uid}</small>
        </div>
      ))}
    </div>
  );
}
