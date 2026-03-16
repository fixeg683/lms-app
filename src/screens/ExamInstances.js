import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const ExamInstances = () => {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const fetchExams = async () => {
      const { data } = await supabase.from('exam_instances').select('*');
      setExams(data || []);
    };
    fetchExams();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Exam Instances</h1>
          <p className="text-gray-500">Create and manage exam instances</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold">+ New Exam Instance</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs text-gray-400 uppercase">
            <tr>
              <th className="p-4">Exam Name</th>
              <th className="p-4">ID</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {exams.map((exam) => (
              <tr key={exam.id} className="text-sm">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-50 rounded flex items-center justify-center text-yellow-500">📄</div>
                  <span className="font-bold text-gray-700">{exam.name}</span>
                </td>
                <td className="p-4 font-mono text-gray-300 text-xs uppercase">{exam.id.substring(0, 8)}</td>
                <td className="p-4">
                  <div className="flex gap-4">
                    <button className="text-gray-400 hover:text-indigo-600">✎</button>
                    <button className="text-red-300 hover:text-red-500">🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExamInstances;