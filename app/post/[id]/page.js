"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import LikeButton from "@/components/LikeButton";
import CommentBox from "@/components/CommentBox";
import ShareButtons from "@/components/ShareButtons";

export default function SinglePost({ params }) {
  const { id } = params;
  const [post, setPost] = useState(null);

  useEffect(() => {
    const load = async () => {
      const snap = await getDoc(doc(db, "posts", id));
      if (snap.exists()) setPost(snap.data());
    };
    load();
  }, [id]);

  if (!post) return <p className="text-center mt-20">Loading post...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded shadow">

      <h1 className="text-xl font-bold">{post.title}</h1>
      <p className="text-sm text-gray-500">By {post.user}</p>

      {post.mediaURL && (
        <img
          src={post.mediaURL}
          className="w-full mt-4 rounded"
          alt="post media"
        />
      )}

      <p className="mt-4">{post.text}</p>

      {/* LIKE */}
      <LikeButton postId={id} user={post.userData} />

      {/* SHARE */}
      <ShareButtons postId={id} />

      {/* COMMENTS */}
      <CommentBox postId={id} user={post.userData} />
    </div>
  );
}
