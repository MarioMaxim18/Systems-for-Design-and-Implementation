"use client";

import Navbar from "../../components/Navbar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { validateForm } from "../../lib/validation";

export default function AddProgrammingLanguage() {
  const [formData, setFormData] = useState({
    name: "",
    developer: "",
    year: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to add a language!");
      return;
    }

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const dataToSend = { ...formData, createdBy: user._id };

    try {
      const response = await fetch("/api/languages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        router.push("/");
      } else {
        console.error("Failed to add language");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-900 to-black p-6">
        <div className="w-full max-w-5xl">
          {/* Title */}
          <h1 className="text-4xl font-bold text-white mb-6">Add Programming Language</h1>

          {/* Form Container */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-white text-lg mb-2">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Required"
                  className="w-full px-4 py-2 rounded bg-white text-black"
                  required
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Developer */}
              <div>
                <label className="block text-white text-lg mb-2">Developer:</label>
                <input
                  type="text"
                  name="developer"
                  value={formData.developer}
                  onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                  placeholder="Required"
                  className="w-full px-4 py-2 rounded bg-white text-black"
                  required
                />
                {errors.developer && <p className="text-red-400 text-sm mt-1">{errors.developer}</p>}
              </div>

              {/* Year */}
              <div>
                <label className="block text-white text-lg mb-2">Year Released:</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="Required"
                  className="w-full px-4 py-2 rounded bg-white text-black"
                  required
                />
                {errors.year && <p className="text-red-400 text-sm mt-1">{errors.year}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-white text-lg mb-2">Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Required"
                  className="w-full px-4 py-2 h-32 rounded bg-white text-black"
                  required
                />
                {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* Submit */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                >
                  Done
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}