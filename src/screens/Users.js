import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import AddUserModal from '../components/AddUserModal';
import DeleteModal from '../components/DeleteModal';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState({ open: false, id: null, name: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // ✅ We only order by created_at if you have run the SQL to add that column.
      // If you haven't run the SQL yet, remove the .order() line.
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('username', { ascending: true }); 

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Fetch error:', error.message);
      Alert.alert('Error', 'Could not load users.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', deleteConfig.id);
      if (error) throw error;
      setUsers(users.filter(u => u.id !== deleteConfig.id));
      setDeleteConfig({ open: false, id: null, name: '' });
    } catch (error) {
      Alert.alert('Error', 'Failed to delete user');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Users</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setIsAddModalOpen(true)}>
          <Text style={styles.addText}>+ Add User</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, { flex: 2 }]}>USERNAME</Text>
          <Text style={[styles.headerText, { flex: 1.5 }]}>ROLE</Text>
          <Text style={[styles.headerText, { flex: 1, textAlign: 'right' }]}>ACTIONS</Text>
        </View>

        {loading ? (
          <ActivityIndicator style={{ margin: 20 }} color="#4F46E5" />
        ) : users.length === 0 ? (
          <Text style={styles.empty}>No users found</Text>
        ) : (
          users.map((user) => (
            <View key={user.id} style={styles.row}>
              <Text style={[styles.cell, { flex: 2 }]}>{user.username}</Text>
              <View style={[styles.badge, { backgroundColor: user.role === 'Admin' ? '#F3E8FF' : '#DCFCE7' }]}>
                <Text style={{ fontSize: 10, color: user.role === 'Admin' ? '#7E22CE' : '#15803D', fontWeight: 'bold' }}>
                  {user.role?.toUpperCase()}
                </Text>
              </View>
              <View style={[styles.actions, { flex: 1 }]}>
                <TouchableOpacity onPress={() => setDeleteConfig({ open: true, id: user.id, name: user.username })}>
                  <Text style={styles.delete}>🗑</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <AddUserModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onRefresh={fetchUsers} />
      <DeleteModal 
        isOpen={deleteConfig.open} 
        onClose={() => setDeleteConfig({ open: false, id: null, name: '' })} 
        onConfirm={handleDelete} 
        itemName={deleteConfig.name} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  addButton: { backgroundColor: '#4F46E5', padding: 10, borderRadius: 8 },
  addText: { color: '#fff', fontWeight: 'bold' },
  table: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#eee' },
  tableHeader: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderColor: '#eee', backgroundColor: '#F9FAFB' },
  headerText: { fontSize: 12, color: '#9CA3AF', fontWeight: 'bold' },
  row: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderColor: '#eee', alignItems: 'center' },
  cell: { fontSize: 14 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end' },
  delete: { color: '#EF4444', fontSize: 18 },
  empty: { textAlign: 'center', padding: 20, color: '#9CA3AF' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' }
});

export default Users;