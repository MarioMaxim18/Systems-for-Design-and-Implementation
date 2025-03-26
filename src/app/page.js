"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [hasMounted, setHasMounted] = useState(false);
  const [languages, setLanguages] = useState([
    { id: 1, name: "C++", developer: "Bjarne Stroustrup", year: 1985, description: "Low-level features." },
    { id: 2, name: "Java", developer: "James Gosling", year: 1995, description: "Enterprise development." },
    { id: 3, name: "Python", developer: "Guido van Rossum", year: 1991, description: "High-level scripting." }
  ]);
  const [sortBy, setSortBy] = useState("Name");

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("languages");
      const sort = localStorage.getItem("sortBy");
      if (stored) setLanguages(JSON.parse(stored));
      if (sort) setSortBy(sort);
    }
  }, []);
  
  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem("languages", JSON.stringify(languages));
      localStorage.setItem("sortBy", sortBy);
    }
  }, [languages, sortBy, hasMounted]);

  if (!hasMounted) return null;

  function getSortedLanguages() {
    return [...languages].sort((a, b) => {
      if (sortBy === "Name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "Year") {
        return a.year - b.year;
      }
      return 0;
    });
  }

  function getStatistics(languages) {
    const years = languages.map(lang => lang.year);

    const maxYear = Math.max(...years); 
    const minYear = Math.min(...years);

    return { maxYear, minYear };
  }

  const { maxYear, minYear } = getStatistics(languages);

  return (  
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#131414]">
      <div className="w-[800px] flex flex-col items-start mb-4">
        <h2 className="text-xl text-white mb-2">My Learning - Activity</h2>
        
        {/* Sort Dropdown */}
        <div>
          <label className="text-white text-lg mr-2">Sort by:</label>
          <select
            className="px-3 py-2 rounded bg-white border-black"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              localStorage.setItem("sortBy", e.target.value);
            }}
          >
            <option value="Name">Name</option>
            <option value="Year">Year</option>
          </select>
        </div>
      </div>

      {/* Statistics Display */}
      <div className="w-[800px] flex flex-col items-start mb-4">
        <h3 className="text-lg text-white">Statistics</h3>
        <div className="text-white">
          <p>Newest Language Year: {maxYear}</p>
          <p>Oldest Language Year: {minYear}</p>
        </div>
      </div>

      {/* Container */}
      <div className="bg-[#515151] p-8 rounded-lg w-[800px]">

        {/* Programming Languages Container */}
        <div className="rounded-lg w-full">
          {languages.length > 0 ? (
            getSortedLanguages().map((lang) => (
              <div key={lang.id} className="flex items-center justify-between border-b border-black py-2">
                <div>
                  <p className="text-white font-semibold">{lang.name}</p>
                  <p className="text-gray-300 text-sm">ID: #{lang.id}</p>
                </div>
                <div>
                  <button 
                    className="bg-white text-black px-2 py-1 mr-2 rounded" 
                    onClick={() => router.push(`/edit/${lang.id}`)}
                  >
                    Edit
                  </button>
                  <button 
                    className="bg-white text-black px-2 py-1 rounded"
                    onClick={() => {
                      const confirmDelete = window.confirm(`Are you sure you want to delete "${lang.name}"?`);
                      if (confirmDelete) {
                        const updatedLanguages = languages.filter(l => l.id !== lang.id);
                        setLanguages(updatedLanguages);
                        localStorage.setItem("languages", JSON.stringify(updatedLanguages));
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white text-center">No programming languages added yet.</p>
          )}
        </div>
        
        {/* Add Button */}
        <div className="flex justify-center mt-4">
          <button className="px-6 py-2 bg-white hover:bg-gray-300" onClick={() => router.push("/add")}>Add</button>
        </div>
      </div>
    </div>
  );
}