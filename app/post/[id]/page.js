"use client";

import { useParams } from "next/navigation";
import DetailedPost from "@/app/components/DetailedPost";

export default function PostPage() {
  const { id } = useParams();

  if (!id) return <p className="p-4">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <DetailedPost postId={id} />
    </div>
  );
}
