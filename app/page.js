"use client";

import { useState, useEffect } from "react";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";

export default function Home() {
  const [storage, setStorage] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Load Firebase client storage dynamically
  useEffect(() => {
    import("../firebase/clientStorage").then((m) => setStorage(m.storage));
  }, []);

  // Load all photos from Firebase
  const loadPhotos = async () => {
    if (!storage) return;

    const listRef = ref(storage, "uploads/");
    const items = await listAll(listRef);

    const urls = await Promise.all(
      items.items.map((item) => getDownloadURL(item))
    );

    setFiles(urls);
  };

  useEffect(() => {
    if (storage) loadPhotos();
  }, [storage]);

  // Upload file
  const handleUpload = async (e) => {
    if (!storage) return;

    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const fileRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
    await uploadBytes(fileRef, file);

    setUploading(false);
    loadPhotos();
  };

  if (!storage) return <p className="p-4">Loading...</p>;

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">XPic — Upload & View Images</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="mb-4"
      />

      {uploading && <p>Uploading...</p>}

      <div className="grid grid-cols-2 gap-4">
        {files.map((url, i) => (
          <img
            key={i}
            src={url}
            className="w-full rounded-lg"
            alt={`upload-${i}`}
          />
        ))}
      </div>
    </main>
  );
}
