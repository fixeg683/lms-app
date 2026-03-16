import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const Grades = () => {
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    const { data } = await supabase
      .from('grades')
      .select(`
        id, score, status, created_at,
        students (full_name),
        subjects (name)
      `);
    setGrades(data || []);
  };

  const getRubric = (score) => {
    if (score >= 80) return { label: 'EE 1', color: 'bg-green-500' };
    if (score >= 70) return { label: 'EE 2', color: 'bg-green-400' };
    if (score >= 50) return { label: 'ME 2', color: 'bg-blue-400' };
    return { label: 'BE', color: 'bg-red-400' };
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Grades</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
          + Add Grade
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold">Student</th>
              <th className="p-4 font-semibold">Subject</th>
              <th className="p-4 font-semibold text-center">Score</th>
              <th className="p-4 font-semibold">Rubric</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {grades.map((grade) => {
              const rubric = getRubric(grade.score);
              return (
                <tr key={grade.id} className="hover:bg-gray-50 transition text-sm">
                  <td className="p-4 font-medium text-gray-700">{grade.students?.full_name}</td>
                  <td className="p-4 text-purple-600 font-medium">{grade.subjects?.name}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-12 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div className={`${rubric.color} h-full`} style={{width: `${grade.score}%`}}></div>
                        </div>
                        <span className="font-bold text-green-600">{grade.score}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`${rubric.color} text-white text-[10px] font-bold px-2 py-1 rounded-md`}>
                      {rubric.label}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded w-fit text-xs font-bold">
                      🔒 {grade.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-indigo-600 border rounded">Edit</button>
                        <button className="p-1.5 text-red-400 hover:bg-red-50 border rounded">Del</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Grades;