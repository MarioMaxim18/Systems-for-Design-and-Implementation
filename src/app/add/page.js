"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateForm } from "../lib/validation";  

export default function AddProgrammingLanguage() {
  const [formData, setFormData] = useState({
    name: "",
    developer: "",
    year: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const router = useRouter();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // Handle form submission to API
  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateForm(formData); 
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch("/api/languages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#131414]">
        <div className="w-[800px] flex flex-col items-start mb-4">
            <h2 className="text-xl text-white mb-2">Add Programming Language</h2>
        </div>
        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-[#515151] p-8 rounded-lg w-[800px] space-y-4">
            {/* Name Input */}
            <div className="flex items-center justify-between">
                <label className="text-white text-lg">Name:</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="(Required: text)"
                    className="w-2/3 px-3 py-2 rounded bg-white border-black"
                    required
                />
            </div>
            {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}

            {/* Developer Input */}
            <div className="flex items-center justify-between">
                <label className="text-white text-lg">Developer:</label>
                <input
                    type="text"
                    name="developer"
                    value={formData.developer}
                    onChange={handleChange}
                    placeholder="(Required: text)"
                    className="w-2/3 px-3 py-2 rounded bg-white border-black"
                    required
                />
            </div>
            {errors.developer && <p className="text-red-400 text-sm">{errors.developer}</p>}

            {/* Year Released Input */}
            <div className="flex items-center justify-between">
                <label className="text-white text-lg">Year released:</label>
                <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="(Required: valid year)"
                    className="w-2/3 px-3 py-2 rounded bg-white border-black"
                    required
                />
            </div>
            {errors.year && <p className="text-red-400 text-sm">{errors.year}</p>}

            {/* Description Input */}
            <div className="flex items-start justify-between">
                <label className="text-white text-lg mt-2">Description:</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="(Required: text)"
                    className="w-2/3 px-3 py-2 h-24 rounded bg-white border-black"
                    required
                ></textarea>
            </div>
            {errors.description && <p className="text-red-400 text-sm">{errors.description}</p>}

            {/* Done Button */}
            <div className="flex justify-center">
                <button type="submit" className="px-6 py-2 mt-4 bg-white hover:bg-gray-300">Done</button>
            </div>
        </form>
    </div>
  );
}