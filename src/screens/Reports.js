import React, { useState } from 'react';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('student');

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
        <p className="text-gray-500">Generate and view performance reports</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-4 mb-8 bg-white p-2 rounded-xl w-fit border border-gray-100 shadow-sm">
        {['Student Report', 'Class Report', 'Subject Report'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.split(' ')[0].toLowerCase())}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition ${
              activeTab === tab.split(' ')[0].toLowerCase() 
              ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' 
              : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Generator Form */}
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap gap-6 items-end">
        <div className="flex-1 min-w-[250px]">
          <label className="block text-sm font-bold text-gray-700 mb-2">Select Student</label>
          <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-400 focus:ring-2 focus:ring-indigo-500">
            <option>Choose a student...</option>
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-bold text-gray-700 mb-2">Filter by Exam</label>
          <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-indigo-500">
            <option>All Exams</option>
          </select>
        </div>

        <button className="bg-indigo-200 text-indigo-700 px-8 py-3 rounded-xl font-bold hover:bg-indigo-300 shadow-sm">
          Generate Report
        </button>
      </div>
    </div>
  );
};

export default Reports;