// components/FollowButton.jsx
"use client";

import { useEffect, useState } from "react";
import { auth, firestore } from "@/firebase/clientApp";
import {
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  onSnapshot,
  increment,
  updateDoc,
} from "firebase/firestore";
import { sendNotification } from "@/utils/notifications";

/**
 * FollowButton
 * props:
 *  - uid: the profile user id (the person to follow/unfollow)
 */
export default function FollowButton({ uid }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const followDocId = () =>
    currentUser ? `${currentUser.uid}_${uid}` : null;

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((u) => {
      setCurrentUser(u);
    });
    return () => unsubAuth();
  }, []);

  // Watch follow doc
  useEffect(() => {
    if (!currentUser || !uid) {
      setIsFollowing(false);
      setLoading(false);
      return;
    }
    const id = followDocId();
    const ref = doc(firestore, "follows", id);
    const unsub = onSnapshot(ref, (snap) => {
      setIsFollowing(snap.exists());
      setLoading(false);
    });
    return () => unsub();
  }, [currentUser, uid]);

  const handleFollow = async () => {
    if (!currentUser) return alert("Please sign in to follow users.");

    const id = followDocId();
    const followRef = doc(firestore, "follows", id);
    const followedUserRef = doc(firestore, "users", uid);
    const followerUserRef = doc(firestore, "users", currentUser.uid);

    try {
      if (isFollowing) {
        // unfollow: delete follow doc & decrement counts
        await deleteDoc(followRef);
        // decrement counts (merge)
        await updateDoc(followedUserRef, {
          followersCount: increment(-1),
        }).catch(() => {});
        await updateDoc(followerUserRef, {
          followingCount: increment(-1),
        }).catch(() => {});
      } else {
        // follow: create follow doc
        await setDoc(followRef, {
          followerUid: currentUser.uid,
          followedUid: uid,
          createdAt: new Date(),
        });
        await updateDoc(followedUserRef, {
          followersCount: increment(1),
        }).catch(() => {});
        await updateDoc(followerUserRef, {
          followingCount: increment(1),
        }).catch(() => {});

        // send notification to the followed user
        await sendNotification({
          toUid: uid,
          fromUid: currentUser.uid,
          type: "follow",
          message: `${currentUser.displayName || currentUser.email} started following you.`,
        });
      }
    } catch (err) {
      console.error("follow/unfollow error", err);
      alert("Failed to update follow. Try again.");
    }
  };

  // Render
  if (!uid) return null;
  if (!currentUser) {
    // show follow button (will ask sign-in if clicked)
    return (
      <button
        onClick={() => alert("Please sign in to follow users.")}
        className="px-3 py-1 rounded bg-blue-600 text-white"
      >
        Follow
      </button>
    );
  }

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`px-3 py-1 rounded font-semibold ${
        isFollowing ? "bg-gray-200 text-gray-800" : "bg-blue-600 text-white"
      }`}
    >
      {loading ? "..." : isFollowing ? "Following" : "Follow"}
    </button>
  );
}
