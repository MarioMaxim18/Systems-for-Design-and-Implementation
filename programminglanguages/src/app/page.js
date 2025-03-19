"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  const [languages, setLanguages] = useState([
   
  ]);

  return (  
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#131414]">
      {/* Title & Sort Section */}
      <div className="w-[800px] flex flex-col items-start mb-4">
        <h2 className="text-xl text-white mb-2">My Learning - Activity</h2>

        {/* Sort Dropdown */}
        <div>
          <label className="text-white text-lg mr-2">Sort by:</label>
          <select className="px-3 py-2 rounded bg-white border-black">
            <option>Name</option>
            <option>Year</option>
          </select>
        </div>
      </div>

      {/* Container */}
      <div className="bg-[#515151] p-8 rounded-lg w-[800px]">

        {/* Programming Languages Container */}
        <div className=" rounded-lg w-full">
          {languages.map((lang, index) => (
            <div key={index} className="flex items-center justify-between border-b border-black py-2">
              <div>
                <p className="text-white font-semibold">{lang.name}</p>
                <p className="text-gray-300 text-sm">ID: #{lang.id}</p>
              </div>
              <div>
                <button className="bg-white text-black px-2 py-1 mr-2 rounded">Edit</button>
                <button className="bg-white text-black px-2 py-1 rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Button */}
        <div className="flex justify-center mt-4">
          <button className="px-6 py-2 bg-white hover:bg-gray-300" onClick={() => router.push("/add")}>Add</button>
        </div>
      </div>
    </div>
  );
}``