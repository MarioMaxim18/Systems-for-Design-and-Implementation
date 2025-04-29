"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.refresh(); 
  };

  return (
    <nav className="w-full bg-gray-900 text-white px-6 py-4 flex justify-end items-center shadow-md">
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm">{user.name}</span>
          <button
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <a href="/register" className="hover:underline">Register</a>
          <a href="/login" className="hover:underline">Login</a>
        </div>
      )}
    </nav>
  );
}