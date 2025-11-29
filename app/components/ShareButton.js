"use client";
export default function ShareButtons({ postId }) {
  const url =
    typeof window !== "undefined"
      ? window.location.origin + "/post/" + postId
      : "";

  return (
    <div className="flex space-x-3 mt-3">
      <a
        href={`https://wa.me/?text=${encodeURIComponent(url)}`}
        target="_blank"
        className="text-green-600 font-semibold"
      >
        WhatsApp
      </a>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        className="text-blue-600 font-semibold"
      >
        Facebook
      </a>

      <a
        href={`https://www.messenger.com/t/?link=${encodeURIComponent(url)}`}
        target="_blank"
        className="text-blue-500 font-semibold"
      >
        Messenger
      </a>
    </div>
  );
}
