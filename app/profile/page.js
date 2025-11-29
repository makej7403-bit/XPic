"use client";

import { useEffect, useState } from "react";
import { firestore } from "@/firebase/clientApp";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import Image from "next/image";

export default function ProfilePage() {
  const [posts, setPosts] = useState([]);

  async function loadPosts() {
    const q = query(collection(firestore, "posts"), orderBy("createdAt", "desc"));

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPosts(data);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-6 p-4">
      <h1 className="text-3xl font-bold mb-4">Your Profile</h1>

      <h2 className="text-xl font-semibold mb-2">Your Posts</h2>

      {/* Posts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow p-3">
            <Image
              width={400}
              height={400}
              src={post.imageUrl}
              alt="post image"
              className="rounded-lg mb-2"
            />
            <p>{post.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
