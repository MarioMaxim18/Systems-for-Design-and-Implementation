"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleRegister(e) {
    e.preventDefault();
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Registered successfully!");
      router.push("/login");
    } else {
      alert("❌ " + data.error);
    }
  }

  return (
    <div className="min-h-screen bg-[#131414] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#3a3a3a] p-8 rounded-lg shadow-md">
        <h2 className="text-white text-2xl mb-6 font-bold text-center">Register</h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="p-3 rounded bg-white text-black placeholder-gray-400"
          />
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-3 rounded bg-white text-black placeholder-gray-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-3 rounded bg-white text-black placeholder-gray-400"
          />
          <button
            type="submit"
            className="w-full bg-white text-black py-2 rounded hover:bg-gray-200 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}