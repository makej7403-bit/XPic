"use client";
import { useEffect, useState } from "react";
import { storage } from "../firebase/config";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import NavBar from "../components/NavBar";

export default function HomePage() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const listRef = ref(storage, "uploads/");
      const result = await listAll(listRef);

      const urlPromises = result.items.map((imageRef) =>
        getDownloadURL(imageRef)
      );

      const urls = await Promise.all(urlPromises);
      setImages(urls);
    };

    fetchImages();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />

      <h1 className="text-2xl font-bold text-center mt-6">All Pictures</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-6">
        {images.map((url, index) => (
          <img
            key={index}
            src={url}
            alt="Uploaded"
            className="w-full h-48 object-cover rounded-lg shadow"
          />
        ))}
      </div>
    </div>
  );
}
