"use client";
import { useState, useEffect } from "react";
import { db } from "@/firebase";
import {
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

export default function LikeButton({ postId, user }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const likeRef = doc(db, "posts", postId, "likes", user?.uid || "guest");

    const unsubLike = onSnapshot(likeRef, (docSnap) => {
      setLiked(docSnap.exists());
    });

    const unsubCount = onSnapshot(
      doc(db, "posts", postId),
      (snapshot) => {
        setLikeCount(snapshot.data()?.likes || 0);
      }
    );

    return () => {
      unsubLike();
      unsubCount();
    };
  }, [postId, user]);

  const toggleLike = async () => {
    const likeRef = doc(db, "posts", postId, "likes", user?.uid);

    if (liked) {
      await deleteDoc(likeRef);
      await setDoc(doc(db, "posts", postId), {
        likes: likeCount - 1,
      }, { merge: true });
    } else {
      await setDoc(likeRef, {
        liked: true,
      });
      await setDoc(doc(db, "posts", postId), {
        likes: likeCount + 1,
      }, { merge: true });
    }
  };

  return (
    <button
      onClick={toggleLike}
      className="text-blue-600 font-semibold"
    >
      👍 {liked ? "Liked" : "Like"} ({likeCount})
    </button>
  );
}
