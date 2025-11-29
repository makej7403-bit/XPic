"use client";
import { useState } from "react";
import { db, storage } from "@/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function UploadPost() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    let downloadURL = null;

    try {
      if (file) {
        const fileRef = ref(storage, `uploads/${file.name}-${Date.now()}`);
        await uploadBytes(fileRef, file);
        downloadURL = await getDownloadURL(fileRef);
      }

      await addDoc(collection(db, "posts"), {
        title,
        author,
        content,
        downloadURL,
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setAuthor("");
      setContent("");
      setFile(null);
      alert("Post uploaded successfully!");
    } catch (error) {
      console.error("Error uploading post:", error);
      alert("Failed to upload post");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border p-5 rounded-lg shadow bg-white">
      <h2 className="text-xl font-bold mb-4">Upload New Post</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Post Title"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Author Name"
          className="w-full p-2 border rounded"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />

        <textarea
          placeholder="Post Content..."
          className="w-full p-2 border rounded h-32"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <input
          type="file"
          className="w-full"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded font-semibold"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Post"}
        </button>
      </form>
    </div>
  );
}
