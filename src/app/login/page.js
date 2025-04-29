"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify({ _id: result.userId, name: result.name }));

        router.push("/"); 
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="p-2 border" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="p-2 border" />
        <button type="submit" className="p-2 bg-green-600 text-white">Login</button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}