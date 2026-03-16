import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSubjects: 0,
    gradesEntered: 0,
    averageScore: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const { data: students } = await supabase.from('students').select('id', { count: 'exact' });
    const { data: subjects } = await supabase.from('subjects').select('id', { count: 'exact' });
    const { data: grades } = await supabase.from('grades').select('score');

    const avg = grades?.length > 0 
      ? (grades.reduce((acc, curr) => acc + curr.score, 0) / grades.length).toFixed(1) 
      : 0;

    setStats({
      totalStudents: students?.length || 0,
      totalSubjects: subjects?.length || 0,
      gradesEntered: grades?.length || 0,
      averageScore: avg
    });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      <p className="text-gray-500 mb-8">Overview of your exam management system</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Students', value: stats.totalStudents, icon: '👥', color: 'bg-blue-50' },
          { label: 'Total Subjects', value: stats.totalSubjects, icon: '📚', color: 'bg-purple-50' },
          { label: 'Grades Entered', value: stats.gradesEntered, icon: '✅', color: 'bg-green-50' },
          { label: 'Average Score', value: `${stats.averageScore}%`, icon: '🏆', color: 'bg-yellow-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
            </div>
            <span className={`text-2xl p-3 rounded-xl ${stat.color}`}>{stat.icon}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Subject Averages Section (Simplified for match) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Subject Averages</h3>
          <div className="space-y-4">
             {/* Progress bars matching your screenshot style */}
             <div>
                <div className="flex justify-between text-sm mb-1">
                    <span>Mathematics</span>
                    <span className="font-bold">69.8</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '69.8%'}}></div>
                </div>
             </div>
          </div>
        </div>

        {/* Top Performers Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Top Performers</h3>
          <div className="space-y-6">
            {['sammy', 'viola faith', 'rowlands onyango'].map((name, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-400 text-white' : 'bg-gray-200'}`}>{i+1}</span>
                    <div>
                        <p className="text-sm font-bold capitalize">{name}</p>
                        <p className="text-xs text-gray-400">grade 8 red</p>
                    </div>
                </div>
                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded">EE 2</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;