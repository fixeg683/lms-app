import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { supabase } from '../lib/supabase';

// ✅ UUID generator (simple & safe)
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const AddUserModal = ({ isOpen, onClose, onRefresh }) => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('Teacher');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!username.trim()) {
      Alert.alert('Validation', 'Username is required');
      return;
    }

    setLoading(true);

    try {
      const newUser = {
        id: generateUUID(), // ✅ FIX: provide id
        username: username.trim(),
        role: role.trim() || 'Teacher'
      };

      const { error } = await supabase
        .from('profiles')
        .insert([newUser]);

      if (error) throw error;

      // ✅ Reset state
      setUsername('');
      setRole('Teacher');

      onClose?.();
      onRefresh?.();

    } catch (error) {
      console.error('Add user error:', error?.message || error);
      Alert.alert('Error', error.message || 'Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={!!isOpen} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Add New User</Text>

          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />

          <TextInput
            placeholder="Role (Admin/Teacher)"
            value={role}
            onChangeText={setRole}
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={styles.button}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleAdd} style={styles.button} disabled={loading}>
              <Text style={styles.add}>
                {loading ? 'Creating...' : 'Create User'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddUserModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 20,
    elevation: 10,
  },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8
  },
  button: { paddingHorizontal: 16, paddingVertical: 10 },
  cancel: { color: '#6B7280', fontWeight: '600' },
  add: { color: '#4F46E5', fontWeight: 'bold' },
});