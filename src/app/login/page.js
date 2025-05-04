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
        const user = {
          _id: result.userId,
          name: result.name,
          role: result.role,
        };
  
        localStorage.setItem("user", JSON.stringify(user));
  
        if (user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  }

  return (
    <div className="min-h-screen bg-[#131414] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#3a3a3a] p-8 rounded-lg shadow-md">
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
            className="w-full bg-white text-black py-2 rounded hover:bg-gray-200 transition"
          >
            Login
          </button>
        </form>

        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}
