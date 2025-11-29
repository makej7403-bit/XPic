// components/ShareButtonsFull.jsx
"use client";

import { useState } from "react";

export default function ShareButtonsFull({ postId }) {
  const [copied, setCopied] = useState(false);

  const url =
    typeof window !== "undefined"
      ? window.location.origin + "/post/" + postId
      : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("copy failed", err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this post on XPic",
          url,
        });
      } catch (err) {
        console.error("share failed", err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="mt-3 flex items-center gap-3">
      <button onClick={handleNativeShare} className="px-3 py-1 bg-gray-800 text-white rounded">
        Share
      </button>

      <a
        href={`https://wa.me/?text=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noreferrer"
        className="px-3 py-1 bg-green-500 text-white rounded"
      >
        WhatsApp
      </a>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noreferrer"
        className="px-3 py-1 bg-blue-600 text-white rounded"
      >
        Facebook
      </a>

      <button onClick={handleCopy} className="px-3 py-1 bg-gray-200 rounded">
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
