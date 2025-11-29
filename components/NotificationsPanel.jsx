// components/NotificationsPanel.jsx
"use client";

import { useEffect, useState } from "react";
import { auth, firestore } from "@/firebase/clientApp";
import {
  query,
  collection,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function NotificationsPanel() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(firestore, "notifications"),
      where("toUid", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setNotifications(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [user]);

  const markRead = async (id) => {
    try {
      const ref = doc(firestore, "notifications", id);
      await updateDoc(ref, { read: true });
    } catch (err) {
      console.error("mark read err", err);
    }
  };

  if (!user) {
    return <div className="p-3">Sign in to see notifications</div>;
  }

  return (
    <div className="max-w-md">
      <h3 className="font-semibold mb-2">Notifications</h3>
      <div className="space-y-2">
        {notifications.length === 0 && <p className="text-gray-500">No notifications</p>}
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-3 rounded border ${n.read ? "bg-white" : "bg-blue-50"}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-sm">
                  {n.message || `${n.fromUid} ${n.type}`}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {n.createdAt?.toDate ? n.createdAt.toDate().toLocaleString() : ""}
                </div>
              </div>

              {!n.read && (
                <button
                  onClick={() => markRead(n.id)}
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
                >
                  Mark read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
