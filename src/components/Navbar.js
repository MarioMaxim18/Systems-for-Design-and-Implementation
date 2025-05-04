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
    window.location.reload();
  };

  return (
    <nav className="w-full bg-[#131414] px-8 py-4 flex justify-between items-center shadow-md border-b border-[#333]">
      <h1 className="text-white text-xl font-semibold">My Learning</h1>

      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-white text-sm font-medium">{user.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white text-sm font-semibold transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <a href="/register" className="text-white text-sm font-medium hover:text-blue-400 transition">Register</a>
          <a href="/login" className="text-white text-sm font-medium hover:text-blue-400 transition">Login</a>
        </div>
      )}
    </nav>
  );
}