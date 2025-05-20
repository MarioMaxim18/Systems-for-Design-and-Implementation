"use client";

import Navbar from "../components/Navbar"; 
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Home() {
  const router = useRouter();
  const [languages, setLanguages] = useState([]);
  const [sortBy, setSortBy] = useState("ID");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    async function fetchLanguages() {
      if (!user?._id) {
        setLanguages([]);
        return;
      }

      try {
        const response = await fetch(`/api/languages?sortBy=${sortBy}&userId=${user._id}`);
        if (response.ok) {
          const data = await response.json();
          setLanguages(data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }

    fetchLanguages();
  }, [sortBy, user]);

  const getStatistics = (langs) => {
    if (!langs.length) return { maxYear: 'N/A', minYear: 'N/A' };
    const years = langs.map(lang => lang.year);
    return {
      maxYear: Math.max(...years),
      minYear: Math.min(...years)
    };
  };

  const { maxYear, minYear } = getStatistics(languages);

  const getLanguagesByDecade = (langs) => {
    const grouped = {};
    langs.forEach((lang) => {
      const decade = Math.floor(lang.year / 10) * 10;
      grouped[decade] = (grouped[decade] || 0) + 1;
    });
    return Object.entries(grouped)
      .sort((a, b) => a[0] - b[0])
      .map(([decade, count]) => ({ decade, count }));
  };

  const chartData = getLanguagesByDecade(languages);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#131414]">
        <div className="w-[800px] flex flex-col items-start mb-4 mt-4">
          <div>
            <label className="text-white text-lg mr-2">Sort by:</label>
            <select
              className="px-3 py-2 rounded bg-white border-black"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="ID">ID</option>
              <option value="Name">Name</option>
              <option value="Year">Year</option>
            </select>
          </div>
        </div>

        {/* Statistics */}
        <div className="w-[800px] flex flex-col items-start mb-4">
          <h3 className="text-lg text-white">Statistics:</h3>
          <div className="text-white">
            <p>Newest Language Year: {maxYear}</p>
            <p>Oldest Language Year: {minYear}</p>
          </div>
        </div>

        {/* Languages List */}
        <div className="bg-[#515151] p-8 rounded-lg w-[800px]">
          {languages.length > 0 ? (
            languages.map((lang) => (
              <div key={lang._id} className="flex items-center justify-between border-b border-black py-2">
                <div className="flex flex-col">
                  <p className="text-white font-semibold text-lg">{lang.name}</p>
                  <p className="text-gray-300 text-sm">Developer: {lang.developer}</p>
                  <p className="text-gray-300 text-sm">Year: {lang.year}</p>
                  <p className="text-gray-300 text-sm">Description: {lang.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="bg-white text-black px-2 py-1 rounded"
                    onClick={() => router.push(`/edit/${lang._id}`)}
                  >
                    Edit
                  </button>
                  <button 
                    className="bg-white text-black px-2 py-1 rounded"
                    onClick={async () => {
                      const confirmDelete = window.confirm(`Are you sure you want to delete "${lang.name}"?`);
                      if (confirmDelete) {
                        try {
                          const response = await fetch(`/api/languages?id=${lang._id}`, {
                            method: 'DELETE',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                          });

                          if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                          }

                          const result = await response.json();
                          console.log('Delete successful:', result);
                          setLanguages(languages.filter(l => l._id !== lang._id));
                        } catch (error) {
                          console.error('Error deleting language:', error);
                          alert('Failed to delete language. Please check console for details.');
                        }
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

        {user && (
          <div className="mt-4">
            <button
              className="px-6 py-2 bg-white hover:bg-gray-300"
              onClick={() => router.push("/add")}
            >
              Add New Language
            </button>
          </div>
        )}

        {/* Upload Section */}
        <div className="w-[800px] mt-6 mb-6 bg-[#3a3a3a] p-6 rounded-lg text-white">
          <h3 className="text-lg mb-4 flex items-center gap-2">Upload a File</h3>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const file = e.target.fileInput.files[0];
              if (!file) return alert("Please select a file first.");

              const formData = new FormData();
              formData.append("file", file);

              try {
                const res = await fetch("/api/upload", {
                  method: "POST",
                  body: formData,
                });

                if (res.ok) {
                  const json = await res.json();
                  setUploadedFile(json.filename);
                  e.target.reset();
                }
              } catch (err) {
                setUploadedFile(null);
              }
            }}
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              {!uploadedFile ? (
                <>
                  <label 
                    htmlFor="fileInput" 
                    className="cursor-pointer px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
                  >
                    Select File
                  </label>
                  <input 
                    type="file" 
                    name="fileInput" 
                    id="fileInput" 
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        e.target.form.requestSubmit();
                      }
                    }}
                  />
                </>
              ) : (
                <>
                  <label 
                    htmlFor="fileInput" 
                    className="cursor-pointer px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
                  >
                    Select File
                  </label>
                  <input 
                    type="file" 
                    name="fileInput" 
                    id="fileInput" 
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        e.target.form.requestSubmit();
                      }
                    }}
                  />
                  <div className="text-sm text-gray-200">
                    <a href={`/uploads/${uploadedFile}`} download className="underline text-blue-400">
                      {uploadedFile}
                    </a>
                  </div>
                </>
              )}
            </div>
          </form>
        </div>

        {/* Chart Section */}
        <div className="w-[800px] h-[300px] mt-4 mb-5 bg-white p-4 rounded-lg">
          <h3 className="text-black text-lg mb-2">Languages per Decade</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="decade" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}