import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { supabase } from '../lib/supabase';

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;

      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Users error:', err.message);
      setUsers([]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>User Management</Text>

      {users.map((u) => (
        <View key={u?.id} style={styles.card}>
          <Text style={styles.name}>{u?.username || 'Unknown'}</Text>
          <Text>Role: {u?.role || 'N/A'}</Text>
          <Text>Subjects: {u?.assigned_subjects || '—'}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default Users;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10
  },

  name: { fontWeight: 'bold' }
});