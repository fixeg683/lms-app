import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import AddStudentModal from '../components/AddStudentModal';
import DeleteModal from '../components/DeleteModal';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState({ open: false, id: null, name: '' });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*, classes(name)');
    
    if (error) console.error("Error fetching students:", error);
    else setStudents(data || []);
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', deleteConfig.id);

    if (!error) {
      setDeleteConfig({ open: false, id: null, name: '' });
      fetchStudents();
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Student Management</h1>
          <p className="text-gray-500">Manage student records and information</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition"
        >
          + Add Student
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="text-xs text-gray-400 uppercase bg-gray-50 font-bold">
            <tr>
              <th className="p-4">Student</th>
              <th className="p-4">Class</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.map((student) => (
              <tr key={student.id} className="text-sm hover:bg-gray-50">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase">
                    {/* GUARD: Prevents crash if full_name is null */}
                    {student.full_name ? String(student.full_name).substring(0, 2) : '??'}
                  </div>
                  <span className="font-bold text-gray-700">{String(student.full_name || 'Unknown')}</span>
                </td>
                <td className="p-4">
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                    {/* FIX: Render the string property 'name', not the 'classes' object */}
                    {student.classes?.name || 'Unassigned'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-4">
                    <button className="text-gray-400 hover:text-indigo-600 text-lg">✎</button>
                    <button 
                      onClick={() => setDeleteConfig({ open: true, id: student.id, name: student.full_name })}
                      className="text-red-300 hover:text-red-500 text-lg"
                    >
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddStudentModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onRefresh={fetchStudents} />
      <DeleteModal 
        isOpen={deleteConfig.open} 
        onClose={() => setDeleteConfig({ open: false, id: null, name: '' })} 
        onConfirm={handleDelete}
        itemName={deleteConfig.name}
      />
    </div>
  );
};

export default Students;