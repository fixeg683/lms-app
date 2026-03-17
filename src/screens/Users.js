import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { supabase } from '../lib/supabase';
import AddUserModal from '../components/AddUserModal';
import DeleteModal from '../components/DeleteModal';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState({
    open: false,
    id: null,
    name: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false }); // ✅ better UX

      if (error) throw error;

      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch users error:', error?.message || error);
      Alert.alert('Error', 'Failed to fetch users');
      setUsers([]);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfig?.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', deleteConfig.id);

      if (error) throw error;

      setDeleteConfig({ open: false, id: null, name: '' });

      // ✅ Optimistic update (faster UI)
      setUsers((prev) => prev.filter((u) => u.id !== deleteConfig.id));

    } catch (error) {
      console.error('Delete error:', error?.message || error);
      Alert.alert('Error', 'Failed to delete user');
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Users</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddModalOpen(true)}
        >
          <Text style={styles.addText}>+ Add User</Text>
        </TouchableOpacity>
      </View>

      {/* TABLE */}
      <ScrollView style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, { flex: 2 }]}>
            USERNAME
          </Text>
          <Text style={[styles.headerText, { flex: 1.5 }]}>
            ROLE
          </Text>
          <Text
            style={[
              styles.headerText,
              { flex: 1, textAlign: 'right' }
            ]}
          >
            ACTIONS
          </Text>
        </View>

        {/* EMPTY STATE */}
        {users.length === 0 && (
          <Text style={styles.empty}>No users found</Text>
        )}

        {/* ROWS */}
        {users.map((user) => (
          <View key={user.id} style={styles.row}>
            <Text style={[styles.cell, { flex: 2 }]}>
              {String(user?.username || 'New User')}
            </Text>

            <View style={{ flex: 1.5 }}>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor:
                      user?.role === 'Admin'
                        ? '#F3E8FF'
                        : '#DCFCE7'
                  }
                ]}
              >
                <Text
                  style={{
                    fontSize: 10,
                    color:
                      user?.role === 'Admin'
                        ? '#7E22CE'
                        : '#15803D',
                    fontWeight: 'bold'
                  }}
                >
                  {String(user?.role || 'Teacher').toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={[styles.actions, { flex: 1 }]}>
              <TouchableOpacity>
                <Text style={styles.edit}>✎</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  setDeleteConfig({
                    open: true,
                    id: user.id,
                    name: user.username
                  })
                }
              >
                <Text style={styles.delete}>🗑</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* MODALS */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onRefresh={fetchUsers}
      />

      <DeleteModal
        isOpen={deleteConfig.open}
        onClose={() =>
          setDeleteConfig({ open: false, id: null, name: '' })
        }
        onConfirm={handleDelete}
        itemName={deleteConfig.name}
      />
    </View>
  );
};

export default Users;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFB'
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center'
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827'
  },

  addButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8
  },

  addText: {
    color: '#fff',
    fontWeight: 'bold'
  },

  table: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee'
  },

  tableHeader: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#F9FAFB'
  },

  headerText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: 'bold'
  },

  row: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
    alignItems: 'center'
  },

  cell: {
    fontSize: 14,
    color: '#374151'
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15
  },

  edit: {
    color: '#9CA3AF',
    fontSize: 18
  },

  delete: {
    color: '#EF4444',
    fontSize: 18
  },

  empty: {
    textAlign: 'center',
    padding: 30,
    color: '#9CA3AF'
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start'
  }
});