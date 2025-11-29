// components/Reactions.jsx
"use client";

import { useEffect, useState } from "react";
import { auth, firestore } from "@/firebase/clientApp";
import {
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { sendNotification } from "@/utils/notifications";

export default function Reactions({ postId }) {
  const [user, setUser] = useState(null);
  const [postData, setPostData] = useState(null);
  const emojiList = ["❤️", "🔥", "😂", "👍"];

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!postId) return;
    const ref = doc(firestore, "posts", postId);
    const unsub = onSnapshot(ref, (snap) => setPostData(snap.data()));
    return () => unsub();
  }, [postId]);

  const toggle = async (emoji) => {
    if (!user) return alert("Please sign in to react.");
    if (!postData) return;

    const ref = doc(firestore, "posts", postId);

    const current = postData.reactions || {};
    const arr = current[emoji] || [];
    const has = arr.includes(user.uid);

    try {
      if (has) {
        await updateDoc(ref, {
          [`reactions.${emoji}`]: arrayRemove(user.uid),
        });
      } else {
        await updateDoc(ref, {
          [`reactions.${emoji}`]: arrayUnion(user.uid),
        });

        // notify post owner
        const postSnap = await getDoc(doc(firestore, "posts", postId));
        const pd = postSnap?.data ? postSnap.data() : null;
        if (pd && pd.ownerUid && pd.ownerUid !== user.uid) {
          await sendNotification({
            toUid: pd.ownerUid,
            fromUid: user.uid,
            type: "like",
            postId,
            message: `${user.displayName || user.email} reacted ${emoji} on your post.`,
          });
        }
      }
    } catch (err) {
      console.error("reaction error", err);
    }
  };

  if (!postData) return null;

  return (
    <div className="mt-3 flex gap-3">
      {emojiList.map((em) => {
        const count = postData.reactions?.[em]?.length || 0;
        const userReacted = user && postData.reactions?.[em]?.includes(user.uid);
        return (
          <button
            key={em}
            onClick={() => toggle(em)}
            className={`px-2 py-1 rounded-md ${
              userReacted ? "bg-gray-200" : "bg-gray-100"
            }`}
          >
            <span style={{ fontSize: 18 }}>{em}</span> <span className="ml-1 text-sm">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
