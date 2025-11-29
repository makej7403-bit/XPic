"use client";

import { useEffect, useState } from "react";
import { auth, firestore } from "@/firebase/clientApp";
import { query, collection, where, orderBy, onSnapshot } from "firebase/firestore";
import ProfileCard from "@/components/ProfileCard";
import EditProfile from "@/components/EditProfile";
import Image from "next/image";

/**
 * Profile Page (current user)
 */
export default function MyProfilePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Auth listener
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  // Load current user's profile doc (if exists) and posts
  useEffect(() => {
    if (!user) {
      setPosts([]);
      setLoadingPosts(false);
      return;
    }

    // Listen to posts by ownerUid
    const q = query(
      collection(firestore, "posts"),
      where("ownerUid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setPosts(arr);
      setLoadingPosts(false);
    });

    return () => unsub();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-4">
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-semibold">You are not signed in</h2>
          <p className="mt-2 text-gray-600">Please sign in to view and edit your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile summary + editor */}
        <div className="col-span-1 space-y-4">
          <ProfileCard user={{ uid: user.uid, displayName: user.displayName, photoURL: user.photoURL }} />
          <EditProfile />
        </div>

        {/* Right: User posts */}
        <div className="col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Your posts</h2>

          {loadingPosts && <p>Loading posts…</p>}
          {!loadingPosts && posts.length === 0 && <p>No posts yet.</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((p) => (
              <div key={p.id} className="bg-white rounded shadow overflow-hidden">
                {p.imageUrl ? (
                  // Using img tag because next/image may require domains in next.config.js
                  <img src={p.imageUrl} alt="post" className="w-full h-56 object-cover" />
                ) : (
                  <div className="w-full h-56 bg-gray-100 flex items-center justify-center text-gray-500">No media</div>
                )}

                <div className="p-3">
                  <p className="text-sm text-gray-700">{p.caption || p.title || ""}</p>
                  <p className="mt-2 text-xs text-gray-400">{p.createdAt?.toDate ? p.createdAt.toDate().toLocaleString() : ""}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
