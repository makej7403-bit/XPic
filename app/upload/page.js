"use client";
import { useState } from "react";
import NavBar from "../../components/NavBar";
import { storage } from "../../firebase/config";
import { ref, uploadBytes } from "firebase/storage";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select an image.");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const fileRef = ref(storage, `uploads/${file.name}-${Date.now()}`);
      await uploadBytes(fileRef, file);

      setMessage("Upload successful!");
    } catch (error) {
      console.error(error);
      setMessage("Upload failed. Try again.");
    }

    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />

      <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow">
        <h1 className="text-xl font-bold mb-4">Upload a Picture</h1>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>

        {message && (
          <p className="mt-4 text-center font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
