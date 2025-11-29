"use client";

import { useState, useEffect } from "react";
import { auth, firestore, storage } from "@/firebase/clientApp";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

/**
 * EditProfile
 * Props: none — uses currently-signed-in user
 *
 * Saves profile to Firestore document: users/{uid}
 * Stores avatar in Storage path: profilePictures/{uid}/{timestamp}_{filename}
 */
export default function EditProfile() {
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [photoURL, setPhotoURL] = useState(null);

  // Load existing profile from Firestore
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const docRef = doc(firestore, "users", user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setDisplayName(data.displayName || "");
          setBio(data.bio || "");
          setPhotoURL(data.photoURL || null);
        } else {
          // If no doc, fill from auth profile if available
          setDisplayName(user.displayName || "");
          setPhotoURL(user.photoURL || null);
        }
      } catch (err) {
        console.error("Load profile error:", err);
      }
    };
    load();
  }, [user]);

  // upload avatar to storage and return URL
  const uploadAvatar = async (file) => {
    if (!file) return null;
    const path = `profilePictures/${user.uid}/${Date.now()}_${file.name}`;
    const fileRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(fileRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        () => {
          // progress could be handled if desired
        },
        (err) => reject(err),
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in to edit your profile.");
      return;
    }

    setUploading(true);

    try {
      let avatarUrl = photoURL;

      if (avatarFile) {
        avatarUrl = await uploadAvatar(avatarFile);
        setPhotoURL(avatarUrl);
      }

      // Save to Firestore users collection
      const userRef = doc(firestore, "users", user.uid);
      await setDoc(
        userRef,
        {
          uid: user.uid,
          displayName: displayName || null,
          bio: bio || null,
          photoURL: avatarUrl || null,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // Optionally update Firebase Auth profile so auth.currentUser has displayName/photoURL
      try {
        await user.updateProfile?.({
          displayName: displayName || null,
          photoURL: avatarUrl || null,
        });
      } catch (err) {
        // Some Firebase SDK versions require a different method; ignore errors.
      }

      alert("Profile saved.");
    } catch (err) {
      console.error("Save profile failed:", err);
      alert("Failed to save profile. Try again.");
    } finally {
      setUploading(false);
      setAvatarFile(null);
    }
  };

  if (!user) {
    return (
      <div className="p-4 bg-white rounded shadow">
        <p>Please sign in to edit your profile.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSave}
      className="p-4 bg-white rounded-lg shadow space-y-4 max-w-md"
    >
      <h2 className="text-lg font-semibold">Edit Profile</h2>

      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden">
          {photoURL ? (
            <img src={photoURL} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No Photo
            </div>
          )}
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium">Change avatar</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) setAvatarFile(e.target.files[0]);
            }}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Display name</label>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Your display name"
          className="w-full border rounded px-3 py-2 mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Write a short bio"
          className="w-full border rounded px-3 py-2 mt-1"
          rows={3}
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {uploading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  );
}
