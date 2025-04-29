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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black p-6">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
            Login
          </button>
        </form>

        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}