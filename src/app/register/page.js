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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black p-6">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Register</h2>
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
            className="p-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}