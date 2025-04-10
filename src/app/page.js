"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import generateFakeData from "../utils/generateFakeData"; 
import { useConnectionStatus } from "../hooks/useConnectionStatus";
import { syncQueue } from "../utils/offlineQueue";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();

  const [useFakeData] = useState(true); 
  const [languages, setLanguages] = useState([]); 
  const [sortBy, setSortBy] = useState("ID"); 
  const [refreshKey, setRefreshKey] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);

  const languagesPerPage = 10;
  const [hasMore, setHasMore] = useState(true); 
  const observer = useRef();

  useEffect(() => {
    if (useFakeData) {
      const fakeData = generateFakeData(100);
      setLanguages(fakeData.slice(0, languagesPerPage)); 
    } else {
      async function fetchLanguages() {
        try {
          const response = await fetch(`/api/languages?sortBy=${sortBy}&t=${Date.now()}`);
          if (response.ok) {
            const data = await response.json();
            setLanguages(data.slice(0, languagesPerPage));
          }
        } catch (error) {
          console.error("Fetch error:", error);
        }
      }
      fetchLanguages();
    }
  }, [useFakeData, refreshKey, sortBy]);

  useEffect(() => {
    const loadMore = (entries) => {
      if (entries[0].isIntersecting) {
        loadMoreLanguages();
      }
    };

    observer.current = new IntersectionObserver(loadMore, { rootMargin: "100px" });

    const target = document.getElementById("load-more-target");
    if (target) observer.current.observe(target);

    return () => observer.current.disconnect();
  }, [languages]);

  const loadMoreLanguages = () => {
    if (!hasMore) return; 

    const newData = useFakeData ? generateFakeData(languagesPerPage) : [];
    setLanguages((prev) => [...prev, ...newData]);

    if (languages.length + newData.length >= 100) {
      setHasMore(false);
    }
  };

  function getStatistics(languages) {
    const years = languages.map(lang => lang.year);
    const maxYear = Math.max(...years);
    const minYear = Math.min(...years);
    return { maxYear, minYear };
  }

  const { maxYear, minYear } = getStatistics(languages);

  function getLanguagesByDecade(languages) {
    const grouped = {};
    languages.forEach((lang) => {
      const decade = Math.floor(lang.year / 10) * 10;
      grouped[decade] = (grouped[decade] || 0) + 1;
    });
    return Object.entries(grouped)
      .sort((a, b) => a[0] - b[0])
      .map(([decade, count]) => ({ decade, count }));
  }

  const chartData = getLanguagesByDecade(languages);

  const { isOnline, serverUp } = useConnectionStatus();
 
  useEffect(() => {
    if (isOnline && serverUp) {
      syncQueue(() => {
        setRefreshKey((k) => k + 1);
      });
    }
  }, [isOnline, serverUp]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4001");
  
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "new_entity") {
        setLanguages((prev) => {
          const updated = [message.data, ...prev];
          setHasMore(true); 
          return updated;
        });
      }
    };
  
    return () => ws.close();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#131414]">
      {!isOnline && (
        <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center py-2 z-50 shadow-md">
          ⚠️ You are <strong>offline</strong> — check your internet connection.
        </div>
      )}

      {isOnline && !serverUp && (
        <div className="fixed top-0 left-0 w-full bg-yellow-400 text-black text-center py-2 z-50 shadow-md">
          ⚠️ You are online, but the <strong>server is down</strong>.
        </div>
      )}

      <div className="w-[800px] flex flex-col items-start mb-4">
        <h2 className="text-xl text-white mb-2">My Learning - Activity</h2>

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
        <h3 className="text-lg text-white">Statistics</h3>
        <div className="text-white">
          <p>Newest Language Year: {maxYear}</p>
          <p>Oldest Language Year: {minYear}</p>
        </div>
      </div>

      {/* Languages Container */}
      <div className="bg-[#515151] p-8 rounded-lg w-[800px]">
        {/* Languages Table */}
        <div className="rounded-lg w-full">
        {languages.length > 0 ? (
          languages.map((lang) => {
            return (
              <div key={lang.id} className={`flex items-center justify-between border-b border-black py-2 `}>
              <div className="flex flex-col">
                <p className="text-white font-semibold text-lg">{lang.name}</p>
                <p className="text-gray-300 text-sm">ID: #{lang.id}</p>
                <p className="text-gray-300 text-sm">Developer: {lang.developer}</p>
                <p className="text-gray-300 text-sm">Year: {lang.year}</p>
                <p className="text-gray-300 text-sm">Description: {lang.description}</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  className="bg-white text-black px-2 py-1 rounded"
                  onClick={() => router.push(`/edit/${lang.id}`)}
                >
                  Edit
                </button>

                <button 
                  className="bg-white text-black px-2 py-1 rounded"
                  onClick={async () => {
                    const confirmDelete = window.confirm(`Are you sure you want to delete "${lang.name}"?`);
                    if (confirmDelete) {
                      try {
                        const response = await fetch(`/api/languages?id=${lang.id}`, {
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

                        const updatedLanguages = languages.filter(l => l.id !== lang.id);
                        setLanguages(updatedLanguages);

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
            );
          })
        ) : (
          <p className="text-white text-center">No programming languages added yet.</p>
        )}
        </div>
        {/* Add Button */}
        <div id="load-more-target" className="flex justify-center mt-4">
          {hasMore && (
            <button className="px-6 py-2 bg-white hover:bg-gray-300" onClick={() => router.push("/add")}>Add</button>
          )}
        </div>
      </div>
      {/* Upload Section */}
      <div className="w-[800px] mt-6 mb-6 bg-[#3a3a3a] p-6 rounded-lg text-white">
        <h3 className="text-lg mb-4 flex items-center gap-2">
          📤 Upload a File
        </h3>

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

              if (!res.ok) throw new Error("Upload failed");
              const json = await res.json();
              alert(`✅ Uploaded: ${json.filename}`);
              setUploadedFile(json.filename);
            } catch (err) {
              console.error("❌ Upload error:", err);
              alert("Upload failed. Check console.");
            }
          }}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center space-y-2 mb-4">
              <label
                htmlFor="fileInput"
                className="cursor-pointer px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
              >
                Select File
              </label>
              <span className="text-sm text-gray-200">
                {uploadedFile || "No file selected"}
              </span>
            </div>

            <input
              type="file"
              name="fileInput"
              id="fileInput"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                setUploadedFile(file ? file.name : null);
              }}
            />

            <button
              type="submit"
              className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
            >
              Upload
            </button>
          </div>
        </form>

        {uploadedFile && (
          <div className="mt-4">
            <a
              href={`/uploads/${uploadedFile}`}
              download
              className="underline text-blue-400"
            >
              ⬇ Download {uploadedFile}
            </a>
          </div>
        )}
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
  );
}