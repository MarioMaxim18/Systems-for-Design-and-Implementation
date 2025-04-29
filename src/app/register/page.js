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
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Register</h2>
      <form onSubmit={handleRegister} className="flex flex-col gap-3">
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required className="p-2 border" />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="p-2 border" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="p-2 border" />
        <button type="submit" className="p-2 bg-blue-600 text-white">Register</button>
      </form>
    </div>
  );
}