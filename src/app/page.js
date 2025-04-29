"use client";

import Navbar from "../components/Navbar"; 
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import generateFakeData from "../utils/generateFakeData";
import { useConnectionStatus } from "../hooks/useConnectionStatus";
import { syncQueue } from "../utils/offlineQueue";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();

  const [useFakeData] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [sortBy, setSortBy] = useState("ID");
  const [refreshKey, setRefreshKey] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [user, setUser] = useState(null);

  const languagesPerPage = 10;
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    async function fetchLanguages() {
      if (useFakeData) {
        const fakeData = generateFakeData(100);
        setLanguages(fakeData.slice(0, languagesPerPage));
        return;
      }

      if (!user) {
        setLanguages([]);
        return;
      }

      try {
        const response = await fetch(`/api/languages?sortBy=${sortBy}&userId=${user._id}&t=${Date.now()}`);
        if (response.ok) {
          const data = await response.json();
          setLanguages(data.slice(0, languagesPerPage));
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }

    fetchLanguages();
  }, [useFakeData, refreshKey, sortBy, user]);

  useEffect(() => {
    const loadMore = (entries) => {
      if (entries[0].isIntersecting) loadMoreLanguages();
    };

    observer.current = new IntersectionObserver(loadMore, { rootMargin: "100px" });

    const target = document.getElementById("load-more-target");
    if (target) observer.current.observe(target);

    return () => observer.current.disconnect();
  }, [languages]);

  const loadMoreLanguages = () => {
    if (!hasMore || useFakeData === false) return;
    const newData = generateFakeData(languagesPerPage);
    setLanguages((prev) => [...prev, ...newData]);
    if (languages.length + newData.length >= 100) setHasMore(false);
  };

  const getStatistics = (langs) => {
    const years = langs.map(lang => lang.year);
    const maxYear = Math.max(...years);
    const minYear = Math.min(...years);
    return { maxYear, minYear };
  };

  const { maxYear, minYear } = getStatistics(languages);

  const getLanguagesByDecade = (langs) => {
    const grouped = {};
    langs.forEach((lang) => {
      const decade = Math.floor(lang.year / 10) * 10;
      grouped[decade] = (grouped[decade] || 0) + 1;
    });
    return Object.entries(grouped).sort((a, b) => a[0] - b[0]).map(([decade, count]) => ({ decade, count }));
  };

  const chartData = getLanguagesByDecade(languages);
  const { isOnline, serverUp } = useConnectionStatus();

  useEffect(() => {
    if (isOnline && serverUp) syncQueue(() => setRefreshKey((k) => k + 1));
  }, [isOnline, serverUp]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4001");
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "new_entity" && user && message.data.createdBy === user._id) {
        setLanguages((prev) => [message.data, ...prev]);
        setHasMore(true);
      }
    };
    return () => ws.close();
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-900 to-black p-6">
        {/* Offline and Server Status */}
        {!isOnline && (
          <div className="fixed top-0 left-0 w-full bg-red-500 text-white text-center py-2 shadow-md z-50">
            ⚠️ You are offline — check your internet connection.
          </div>
        )}
        {isOnline && !serverUp && (
          <div className="fixed top-0 left-0 w-full bg-yellow-400 text-black text-center py-2 shadow-md z-50">
            ⚠️ You are online, but the server is down.
          </div>
        )}

        {/* Header */}
        <div className="w-full max-w-5xl">
          <h1 className="text-4xl font-bold text-white mb-6">My Learning Activity</h1>

          <div className="flex justify-between items-center mb-6">
            {/* Sort Dropdown */}
            <div className="flex justify-between items-center mb-6">
              <label className="text-white mr-2">Sort by:</label>
              <select
                className="p-2 rounded bg-white text-black"
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
          <div className="bg-gray-800 p-6 rounded-lg mb-6">
            <h2 className="text-2xl text-white mb-4">📊 Statistics</h2>
            <p className="text-white">Newest Language Year: {maxYear}</p>
            <p className="text-white">Oldest Language Year: {minYear}</p>
          </div>

          {/* Language List */}
          <div className="bg-gray-800 p-6 rounded-lg mb-6">
            <h2 className="text-2xl text-white mb-4">📝 Programming Languages</h2>
            {languages.length > 0 ? languages.map((lang) => (
              <div key={lang._id} className="bg-gray-700 rounded-lg p-4 mb-4 flex justify-between items-center">
                <div>
                  <p className="text-white font-bold text-xl">{lang.name}</p>
                  <p className="text-gray-300 text-sm">Developer: {lang.developer}</p>
                  <p className="text-gray-300 text-sm">Year: {lang.year}</p>
                  <p className="text-gray-300 text-sm">Description: {lang.description}</p>
                </div>
                <div className="flex gap-2">
                  <button className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300" onClick={() => router.push(`/edit/${lang._id}`)}>Edit</button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={async () => { if (window.confirm(`Delete ${lang.name}?`)) { const res = await fetch(`/api/languages?id=${lang._id}`, { method: 'DELETE' }); if (res.ok) setLanguages((prev) => prev.filter(l => l._id !== lang._id)); }}}>Delete</button>
                </div>
              </div>
            )) : (
              <p className="text-white">No languages</p>
            )}
          </div>

          {user && (
            <div className="flex justify-center">
              <button
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => router.push("/add")}
              >Add New Language</button>
            </div>
          )}

        {/* Upload Section */}
        <div className="bg-gray-800 p-6 rounded-lg mt-10">
            <h2 className="text-2xl text-white mb-4">📤 Upload a File</h2>
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
                <label htmlFor="fileInput" className="cursor-pointer px-4 py-2 bg-white text-black rounded hover:bg-gray-200">
                  Select File
                </label>
                <span className="text-sm text-gray-200">{uploadedFile || "No file selected"}</span>
              </div>
              <input type="file" name="fileInput" id="fileInput" className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setUploadedFile(file ? file.name : null);
                }}
              />
              <button type="submit" className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200">Upload</button>
            </div>
          </form>
          {uploadedFile && (
            <div className="mt-4">
              <a href={`/uploads/${uploadedFile}`} download className="underline text-blue-400">
                ⬇ Download {uploadedFile}
              </a>
            </div>
          )}
        </div>

          {/* Chart Section */}
          <div className="bg-white mt-10 p-6 rounded-lg">
            <h2 className="text-2xl text-black mb-4">📈 Languages per Decade</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="decade" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
