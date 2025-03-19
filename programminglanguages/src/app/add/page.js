export default function AddProgrammingLanguage() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#131414]">
        <div className="w-[800px] flex flex-col items-start mb-4">
                <h2 className="text-xl text-white mb-2">Add Programming Languages</h2>
        </div>
        {/* Container */}
        <div className="bg-[#515151] p-8 rounded-lg w-[800px] space-y-4">
            {/* Name Input */}
            <div className="flex items-center justify-between">
              <label className="text-white text-lg">Name:</label>
              <input type="text" placeholder="(Required: text)" className="w-2/3 px-3 py-2 rounded bg-white border-black" />
            </div>
  
            {/* Developer Input */}
            <div className="flex items-center justify-between">
              <label className="text-white text-lg">Developer:</label>
              <input type="text" placeholder="(Required: text)" className="w-2/3 px-3 py-2 rounded bg-white border-black" />
            </div>
  
            {/* Year Released Input */}
            <div className="flex items-center justify-between">
              <label className="text-white text-lg">Year released:</label>
              <input type="text" placeholder="(Required: valid year)" className="w-2/3 px-3 py-2 rounded bg-white border-black" />
            </div>
  
            {/* Description Input */}
            <div className="flex items-start justify-between">
              <label className="text-white text-lg mt-2">Description:</label>
              <textarea placeholder="(Required: text)" className="w-2/3 px-3 py-2 h-24 rounded bg-white border-black"></textarea>
            </div>
  
            {/* Done Button */}
            <div className="flex justify-center">
              <button className="px-6 py-2 mt-4 bg-white hover:bg-gray-300">Done</button>
            </div>
        </div>
    </div>
    );
  }