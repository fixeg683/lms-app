import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      // Assuming you have a custom 'profiles' table for user roles
      const { data } = await supabase.from('profiles').select('*');
      setUsers(data || []);
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-500">Manage admin and teacher accounts</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold">+ Add User</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs text-gray-400 uppercase">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Role</th>
              <th className="p-4">Assigned Subjects</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id} className="text-sm">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs uppercase">
                    {u.username?.substring(0, 2)}
                  </div>
                  <span className="font-bold text-gray-700">{u.username}</span>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    u.role === 'Admin' ? 'bg-purple-50 text-purple-600' : 'bg-green-50 text-green-600'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4 text-gray-500">{u.assigned_subjects || '—'}</td>
                <td className="p-4">
                   <div className="flex gap-4 text-gray-400">
                     <button className="hover:text-indigo-600">✎</button>
                     <button className="hover:text-red-500">🗑</button>
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

export default Users;