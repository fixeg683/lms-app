import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import AddSubjectModal from '../components/AddSubjectModal';
import DeleteModal from '../components/DeleteModal';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState({ open: false, id: null, name: '' });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    const { data } = await supabase.from('subjects').select('*');
    setSubjects(data || []);
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', deleteConfig.id);

    if (!error) {
      setDeleteConfig({ open: false, id: null, name: '' });
      fetchSubjects();
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Subjects</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition"
        >
          + Add Subject
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs text-gray-400 uppercase font-bold">
            <tr>
              <th className="p-4">Subject Name</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {subjects.map((subject) => (
              <tr key={subject.id} className="hover:bg-gray-50 text-sm">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-50 rounded flex items-center justify-center text-purple-400 font-bold">
                    ∫
                  </div>
                  <span className="font-bold text-gray-700">{subject.name}</span>
                </td>
                <td className="p-4 text-gray-400 italic">
                  {subject.description || 'No description provided'}
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-4">
                    <button className="text-gray-400 hover:text-indigo-600">✎</button>
                    <button 
                      onClick={() => setDeleteConfig({ open: true, id: subject.id, name: subject.name })}
                      className="text-red-300 hover:text-red-500"
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

      <AddSubjectModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onRefresh={fetchSubjects} 
      />

      <DeleteModal 
        isOpen={deleteConfig.open} 
        onClose={() => setDeleteConfig({ open: false, id: null, name: '' })} 
        onConfirm={handleDelete}
        itemName={deleteConfig.name}
      />
    </div>
  );
};

export default Subjects;