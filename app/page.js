"use client";

import UploadPost from "@/components/UploadPost";
import PostList from "@/components/PostList";

export default function Home() {
  return (
    <main style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>
        Nursing Courses & Notes Platform
      </h1>

      {/* Upload Section */}
      <section
        style={{
          background: "#f5f5f5",
          padding: "15px",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>
          Upload Study Files, Notes, or Media
        </h2>
        <UploadPost />
      </section>

      {/* Posts Section */}
      <section>
        <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>
          Latest Uploads
        </h2>
        <PostList />
      </section>
    </main>
  );
}
