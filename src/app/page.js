"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Home() {
  const router = useRouter();
  const pathname = usePathname(); 

  const [languages, setLanguages] = useState([]);
  const [sortBy, setSortBy] = useState("ID");
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const languagesPerPage = 4;

  // To handle mounting issues with useEffect
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Effect to load data from the API
  useEffect(() => {
    async function fetchLanguages() {
      try {
        const response = await fetch(`/api/languages?sortBy=${sortBy}&t=${Date.now()}`);
        if (response.ok) {
          const data = await response.json();
          setLanguages(data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
    fetchLanguages();
  }, [pathname, refreshKey, sortBy]);

  // Get statistics
  function getStatistics(languages) {
    const years = languages.map(lang => lang.year);

    const maxYear = Math.max(...years); 
    const minYear = Math.min(...years);

    return { maxYear, minYear };
  }

  const { maxYear, minYear } = getStatistics(languages);

  // Pagination
  const indexOfLastLanguage = currentPage * languagesPerPage;
  const indexOfFirstLanguage = indexOfLastLanguage - languagesPerPage;
  const currentLanguages = languages.slice(indexOfFirstLanguage, indexOfLastLanguage);

  if (!hasMounted) return null;

  // Groups programming languages by the decade they were created
  function getLanguagesByDecade(languages) {
    const grouped = {};
  
    for (const lang of languages) {
      const decade = Math.floor(lang.year / 10) * 10;
      grouped[decade] = (grouped[decade] || 0) + 1;
    }
  
    return Object.entries(grouped)
      .sort((a, b) => a[0] - b[0])
      .map(([decade, count]) => ({ decade, count }));
  }
  
  const chartData = getLanguagesByDecade(languages);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#131414]">
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
          currentLanguages.map((lang) => {
            const isNewest = lang.year === maxYear;
            const isOldest = lang.year === minYear;

            return (
              <div key={lang.id} className={`flex items-center justify-between border-b border-black py-2 ${isNewest ? 'bg-green-500' : ''} ${isOldest ? 'bg-red-500' : ''}`}>
                <div>
                  <p className="text-white font-semibold text-lg">{lang.name}</p>
                  <p className="text-gray-300 text-sm">ID: #{lang.id}</p>
                  <p className="text-gray-300 text-sm">Developer: {lang.developer}</p>
                  <p className="text-gray-300 text-sm">Year: {lang.year}</p>
                  <p className="text-gray-300 text-sm">Description: {lang.description}</p>
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

        {/* Pagination Controls */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white text-black rounded hover:bg-gray-300"
          >
            Previous
          </button>
          <span className="text-white">
            Page {currentPage}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage * languagesPerPage >= languages.length}
            className="px-4 py-2 bg-white text-black rounded hover:bg-gray-300"
          >
            Next
          </button>
        </div>
        {/* Add Button */}
        <div className="flex justify-center mt-4">
          <button className="px-6 py-2 bg-white hover:bg-gray-300" onClick={() => router.push("/add")}>Add</button>
        </div>
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