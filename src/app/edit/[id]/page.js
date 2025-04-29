"use client";

import Navbar from "../../../components/Navbar";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { validateForm } from "../../../lib/validation";

export default function EditProgrammingLanguage() {
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split("/").pop();

  const [formData, setFormData] = useState({
    name: "",
    developer: "",
    year: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchLanguage() {
      try {
        const response = await fetch(`/api/languages?id=${id}`);
        if (response.ok) {
          const language = await response.json();
          setFormData({
            name: language.name || "",
            developer: language.developer || "",
            year: language.year || "",
            description: language.description || "",
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }

    fetchLanguage();
  }, [id]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/languages?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/");
      } else {
        alert("Failed to update language.");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("An error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-900 to-black p-6">
        <div className="w-full max-w-5xl">
          <h1 className="text-4xl font-bold text-white mb-6">Edit Programming Language</h1>

          <div className="bg-gray-800 p-8 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-white text-lg mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter the name"
                  className="w-full p-3 rounded bg-white text-black"
                  required
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Developer */}
              <div>
                <label className="block text-white text-lg mb-2">Developer</label>
                <input
                  type="text"
                  name="developer"
                  value={formData.developer}
                  onChange={handleChange}
                  placeholder="Enter the developer"
                  className="w-full p-3 rounded bg-white text-black"
                  required
                />
                {errors.developer && <p className="text-red-400 text-sm mt-1">{errors.developer}</p>}
              </div>

              {/* Year */}
              <div>
                <label className="block text-white text-lg mb-2">Year Released</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="Enter the year"
                  className="w-full p-3 rounded bg-white text-black"
                  required
                />
                {errors.year && <p className="text-red-400 text-sm mt-1">{errors.year}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-white text-lg mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter the description"
                  className="w-full p-3 h-32 rounded bg-white text-black"
                  required
                ></textarea>
                {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* Save Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}