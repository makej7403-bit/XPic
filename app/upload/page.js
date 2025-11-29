"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { storage, db } from "@/app/firebase/firebaseConfig";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";
import {
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

export default function UploadPage() {
  const router = useRouter();

  const [imageFile, setImageFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!imageFile) {
      alert("Please select an image");
      return;
    }

    setUploading(true);

    const imageRef = ref(storage, `posts/${Date.now()}-${imageFile.name}`);
    const uploadTask = uploadBytesResumable(imageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(Math.round(percent));
      },
      (error) => {
        console.error("Upload error:", error);
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        await addDoc(collection(db, "posts"), {
          imageUrl: downloadURL,
          caption,
          likes: 0,
          createdAt: serverTimestamp(),
        });

        setUploading(false);
        router.push("/");
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-4">Upload New Post</h1>

        <label className="font-semibold">Choose Image</label>
        <input
          type="file"
          accept="image/*"
          className="w-full border p-2 rounded mb-4"
          onChange={handleFileChange}
        />

        <label className="font-semibold">Caption</label>
        <textarea
          className="w-full border p-3 rounded mb-4"
          rows="4"
          placeholder="Write a short caption…"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {uploading ? (
          <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden">
            <div
              className="bg-blue-600 h-4"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        ) : (
          <button
            onClick={handleUpload}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700"
          >
            Upload Post
          </button>
        )}
      </div>
    </div>
  );
}
