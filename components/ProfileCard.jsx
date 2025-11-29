// components/ProfileCard.jsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db, auth } from "@/firebase/clientApp";
import FollowButton from "./FollowButton";

export default function ProfileCard({ uid }) {
  const [profile, setProfile] = useState(null);
  const [counts, setCounts] = useState({ posts: 0, followers: 0, following: 0 });

  useEffect(() => {
    if (!uid) return;
    const pRef = doc(db, "users", uid);
    const unsubProfile = onSnapshot(pRef, snap => {
      if (snap.exists()) setProfile(snap.data());
    });

    // counts: posts, followers, following
    const unsubCounts = onSnapshot(doc(db, "meta", `counts_${uid}`), snap => {
      if (snap.exists()) setCounts(snap.data());
    });

    return () => {
      unsubProfile();
      unsubCounts();
    };
  }, [uid]);

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
          {profile.photoURL ? (
            <img src={profile.photoURL} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold">{profile.displayName || profile.email || "User"}</h2>
          <p className="text-sm text-gray-600">{profile.bio || "No bio yet."}</p>

          <div className="flex gap-4 mt-3 text-sm text-gray-700">
            <div><strong>{counts.posts || 0}</strong> posts</div>
            <div><strong>{counts.followers || 0}</strong> followers</div>
            <div><strong>{counts.following || 0}</strong> following</div>
          </div>
        </div>

        <div>
          <FollowButton targetUid={uid} />
        </div>
      </div>
    </div>
  );
}
