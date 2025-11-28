"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Image from "next/image";

// load Firebase Storage only on client
const loadStorage = () => import("../firebase/clientStorage").then(m => m.storage);

export default function Home() {
  const [storage, setStorage] = useState(null);

  useEffect(() => {
    loadStorage().then(setStorage);
  }, []);

  if (!storage) {
    return <p>Loading...</p>;
  }

  return (
    <main className="p-4">
      {/* your UI here */}
    </main>
  );
}
