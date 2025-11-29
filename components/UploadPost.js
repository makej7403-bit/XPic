"use client";
import { useState } from "react";
import { db, storage, auth } from "@/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function UploadPost() {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");

  const uploadPost = async () => {
    if (!file) return;

    const fileRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);

    await addDoc(collection(db, "posts"), {
      uid: auth.currentUser.uid,
      caption,
      fileURL: url,
      fileType: file.type,
      createdAt: serverTimestamp(),
    });

    setCaption("");
    setFile(null);
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <input
        type="text"
        placeholder="Write a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <button onClick={uploadPost}>Upload</button>
    </div>
  );
}
