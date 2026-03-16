import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const Corrections = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
    // Logic to search for locked grades to unlock them
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Grade Corrections</h1>
        <p className="text-gray-500">Unlock and correct locked grades</p>
      </div>

      {/* Info Banner - Matches the yellow box in your screenshot */}
      <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl mb-8">
        <div className="flex items-center gap-2 text-orange-800 font-bold mb-1 text-sm">
          <span>✎</span> Grade Corrections
        </div>
        <p className="text-orange-700 text-sm">
          Search for a student, unlock their locked grade, make the correction, then save. 
          The grade will be automatically re-locked after saving.
        </p>
      </div>

      {/* Search Bar Section */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="Search by student name or ID..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button 
          onClick={handleSearch}
          className="bg-indigo-200 text-indigo-700 px-8 py-3 rounded-xl font-bold hover:bg-indigo-300 transition"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default Corrections;