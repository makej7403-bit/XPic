"use client";
import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="w-full p-4 flex items-center justify-between bg-gray-900 text-white">
      <h1 className="text-xl font-bold">XPic</h1>

      <div className="flex items-center gap-5">
        <Link href="/" className="hover:text-gray-300">Home</Link>
        <Link href="/upload" className="hover:text-gray-300">Upload</Link>
      </div>
    </nav>
  );
}
