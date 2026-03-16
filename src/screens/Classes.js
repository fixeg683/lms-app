import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import CreateClassModal from '../components/CreateClassModal';
import DeleteModal from '../components/DeleteModal';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState({ open: false, id: null, name: '' });

  useEffect(() => { fetchClasses(); }, []);

  const fetchClasses = async () => {
    const { data } = await supabase.from('classes').select('*, students(count)');
    setClasses(data || []);
  };

  const handleDelete = async () => {
    const { error } = await supabase.from('classes').delete().eq('id', deleteConfig.id);
    if (!error) {
      setDeleteConfig({ open: false, id: null, name: '' });
      fetchClasses();
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Class Management</h1>
          <p className="text-gray-500">Manage classes and student rosters</p>
        </div>
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition"
        >
          + Create New Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative">
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="p-2 text-gray-400 hover:text-indigo-600 bg-gray-50 rounded-lg">✎</button>
              <button 
                onClick={() => setDeleteConfig({ open: true, id: item.id, name: item.name })}
                className="p-2 text-red-400 hover:bg-red-50 bg-red-50/50 rounded-lg"
              >
                🗑
              </button>
            </div>
            {/* Card Content... */}
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 text-indigo-600">∩</div>
            <h3 className="text-xl font-bold text-gray-800 capitalize">{item.name}</h3>
            <p className="text-sm text-gray-400 mb-6">Academic Year: {item.academic_year}</p>
            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
               <span className="text-sm text-gray-500 font-medium">{item.students[0]?.count || 0} students</span>
               <button className="bg-gray-50 text-gray-700 px-4 py-1.5 rounded-lg text-sm font-bold border border-gray-200">Manage Roster</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <CreateClassModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onRefresh={fetchClasses} />
      <DeleteModal 
        isOpen={deleteConfig.open} 
        onClose={() => setDeleteConfig({ open: false, id: null, name: '' })} 
        onConfirm={handleDelete}
        itemName={deleteConfig.name}
      />
    </div>
  );
};

export default Classes;