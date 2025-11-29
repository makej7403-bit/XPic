"use client";

import { useState } from "react";
import { storage, firestore } from "@/firebase/clientApp";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!file) return alert("Please select a photo!");
    setLoading(true);

    try {
      // Create file reference in Firebase Storage
      const fileRef = ref(storage, `posts/${Date.now()}-${file.name}`);

      // Upload the file
      await uploadBytes(fileRef, file);

      // Get file URL
      const url = await getDownloadURL(fileRef);

      // Save post info to Firestore
      await addDoc(collection(firestore, "posts"), {
        imageUrl: url,
        caption: caption,
        createdAt: serverTimestamp(),
      });

      setLoading(false);
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Upload failed!");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-6 bg-white p-6 shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Upload a Photo</h1>

      {/* File Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />

      {/* Caption Input */}
      <textarea
        placeholder="Write a caption..."
        className="w-full border rounded-lg p-2 mb-4"
        rows={3}
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      ></textarea>

      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg w-full"
      >
        {loading ? "Uploading..." : "Upload Post"}
      </button>
    </div>
  );
}
