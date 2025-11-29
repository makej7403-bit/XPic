"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [search, setSearch] = useState("");

  return (
    <header className="w-full bg-white shadow-md p-4 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold text-blue-600">
        XPic
      </Link>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search posts…"
        className="hidden md:block border rounded-lg px-3 py-2 w-64"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Nav links */}
      <nav className="flex items-center gap-4">
        <Link
          href="/"
          className={`px-3 py-2 rounded-lg ${
            pathname === "/" ? "bg-blue-600 text-white" : "text-gray-700"
          }`}
        >
          Home
        </Link>

        <Link
          href="/upload"
          className={`px-3 py-2 rounded-lg ${
            pathname === "/upload"
              ? "bg-blue-600 text-white"
              : "text-gray-700"
          }`}
        >
          Upload
        </Link>

        <Link
          href="/profile"
          className={`px-3 py-2 rounded-lg ${
            pathname === "/profile"
              ? "bg-blue-600 text-white"
              : "text-gray-700"
          }`}
        >
          Profile
        </Link>
      </nav>
    </header>
  );
}
