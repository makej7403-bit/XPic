"use client";

import { useEffect, useState } from "react";
import { firestore } from "@/firebase/clientApp";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

/**
 * Public user profile page
 * Route: /user/[uid]
 */
export default function PublicUserProfilePage({ params }) {
  const { uid } = params;

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Load profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const ref = doc(firestore, "users", uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProfile(snap.data());
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        setLoadingProfile(false);
      }
    };
    loadProfile();
  }, [uid]);

  // Load user posts
  useEffect(() => {
    const q = query(
      collection(firestore, "posts"),
      where("ownerUid", "==", uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setPosts(arr);
        setLoadingPosts(false);
      },
      (err) => {
        console.error("Posts load error:", err);
        setLoadingPosts(false);
      }
    );

    return () => unsub();
  }, [uid]);

  if (loadingProfile) {
    return <div className="p-6 text-center">Loading profile…</div>;
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow text-center">
        <h2 className="text-xl font-semibold">User not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 mt-8">
      {/* Profile top section */}
      <div className="bg-white p-6 rounded-lg shadow flex gap-6 items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
          {profile.photoURL ? (
            <img
              src={profile.photoURL}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
              {profile.displayName ? profile.displayName[0] : "U"}
            </div>
          )}
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold">{profile.displayName || "User"}</h2>
          <p className="text-gray-600">{profile.bio || "No bio yet"}</p>

          {/* follower counts placeholder */}
          <div className="flex gap-6 mt-2 text-sm text-gray-500">
            <span>0 Followers</span>
            <span>0 Following</span>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">
          {profile.displayName || "User"}'s posts
        </h3>

        {loadingPosts && <p>Loading posts…</p>}

        {!loadingPosts && posts.length === 0 && (
          <p className="text-gray-600">No posts yet.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded shadow overflow-hidden"
            >
              {p.imageUrl ? (
                <img
                  src={p.imageUrl}
                  alt=""
                  className="w-full h-56 object-cover"
                />
              ) : (
                <div className="w-full h-56 bg-gray-100 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              <div className="p-3">
                <p className="text-sm">{p.caption || ""}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {p.createdAt?.toDate
                    ? p.createdAt.toDate().toLocaleString()
                    : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
