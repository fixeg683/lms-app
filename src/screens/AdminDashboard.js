import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      <p className="text-gray-500 mb-8">Overview of your exam management system</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card title="Total Students" value="4" icon="👥" color="text-blue-600" />
        <Card title="Total Subjects" value="8" icon="🟣" color="text-purple-600" />
        <Card title="Grades Entered" value="6" icon="🟢" color="text-green-600" />
        <Card title="Average Score" value="75%" icon="🟡" color="text-yellow-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Grade Distribution - Matches Left Panel in Screenshot */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6">Grade Distribution</h3>
          <div className="space-y-6">
            <DistItem label="Approaching (AE)" count="0" percent="0" color="bg-orange-400" />
            <DistItem label="Below (BE)" count="0" percent="0" color="bg-red-400" />
            <DistItem label="Exceeding (EE)" count="4" percent="67" color="bg-green-500" />
            <DistItem label="Meeting (ME)" count="2" percent="33" color="bg-blue-500" />
          </div>
        </div>

        {/* Subject Averages - Middle Panel */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6">Subject Averages</h3>
          <div className="space-y-4">
             <AvgBar label="Mathematics" score="69.8" color="bg-blue-500" count="4" />
             <AvgBar label="Kiswahili" score="85.5" color="bg-green-500" count="2" />
             {['English', 'Integrated Science'].map(sub => (
               <AvgBar key={sub} label={sub} score="0" color="bg-red-400" count="0" />
             ))}
          </div>
        </div>

        {/* Top Performers - Right Panel */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6">Top Performers</h3>
          <div className="space-y-4">
            <Performer rank="1" name="sammy" grade="EE 2" color="bg-yellow-400" />
            <Performer rank="2" name="viola faith" grade="EE 2" color="bg-gray-300" />
            <Performer rank="3" name="rowlands onyango" grade="EE 2" color="bg-orange-300" />
            <Performer rank="4" name="ian" grade="ME 2" color="bg-blue-100" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components for cleaner code
const Card = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-xs font-bold text-gray-400 mb-1">{title}</p>
      <h2 className="text-3xl font-extrabold text-gray-800">{value}</h2>
    </div>
    <div className={`text-2xl p-3 rounded-xl bg-gray-50 ${color}`}>{icon}</div>
  </div>
);

const DistItem = ({ label, count, percent, color }) => (
  <div>
    <div className="flex justify-between text-xs font-bold mb-2">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-400">{count} ({percent}%)</span>
    </div>
    <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden">
      <div className={`${color} h-full`} style={{ width: `${percent}%` }}></div>
    </div>
  </div>
);

const AvgBar = ({ label, score, color, count }) => (
  <div className="mb-4">
    <div className="flex justify-between text-xs mb-1 font-bold text-gray-500">
      <span>{label}</span>
      <span>{count} entries</span>
    </div>
    <div className="flex items-center gap-3">
       <div className="flex-1 bg-gray-50 h-1.5 rounded-full overflow-hidden">
         <div className={`${color} h-full`} style={{ width: `${score}%` }}></div>
       </div>
       <span className={`text-xs font-bold ${score > 0 ? 'text-blue-600' : 'text-red-400'}`}>{score}</span>
    </div>
  </div>
);

const Performer = ({ rank, name, grade, color }) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center gap-3">
      <span className={`w-7 h-7 ${color} text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm`}>{rank}</span>
      <div>
        <p className="text-sm font-bold text-gray-800 capitalize">{name}</p>
        <p className="text-[10px] text-gray-400 uppercase">grade 8 red</p>
      </div>
    </div>
    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-md">{grade}</span>
  </div>
);

export default AdminDashboard;