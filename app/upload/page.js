"use client";

import { useState, useEffect } from "react";

const loadStorage = () =>
  import("../../firebase/clientStorage").then(m => m.storage);

export default function UploadPage() {
  const [storage, setStorage] = useState(null);

  useEffect(() => {
    loadStorage().then(setStorage);
  }, []);

  if (!storage) return <p>Loading...</p>;

  // your upload code here...
}
