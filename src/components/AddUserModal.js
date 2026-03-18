import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../lib/supabase';

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
      const cleanUsername = username.trim().toLowerCase();

      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            username: cleanUsername,
            role: role
          }
        ])
        .select();

      if (error) {
        console.error('Supabase insert error:', error);

        // ✅ FIX: Catch ALL duplicate cases
        if (
          error.code === '23505' ||           // Postgres duplicate
          error.status === 409 ||             // Supabase REST conflict
          error.message?.toLowerCase().includes('duplicate')
        ) {
          throw new Error('User already exists');
        }

        if (error.code === '23502') {
          throw new Error('Missing required field (check DB schema).');
        }

        if (error.code === '42501') {
          throw new Error('Permission denied (RLS issue).');
        }

        throw new Error(error.message || 'Failed to add user.');
      }

      // ✅ Success
      setUsername('');
      setRole('Teacher');

      onClose?.();
      onRefresh?.();

    } catch (err) {
      console.error('Add user failed:', err);
      Alert.alert('Error', err.message || 'Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={!!isOpen} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Add New User</Text>

          <Text style={styles.label}>Username</Text>
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Role</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={role}
              onValueChange={(val) => setRole(val)}
              style={styles.picker}
            >
              <Picker.Item label="Teacher" value="Teacher" />
              <Picker.Item label="Admin" value="Admin" />
            </Picker>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.button}
              disabled={loading}
            >
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleAdd}
              style={[styles.button, styles.addBtn]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#4F46E5" />
              ) : (
                <Text style={styles.add}>Create User</Text>
              )}
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    width: 340,
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 5
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15
  },
  pickerContainer: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden'
  },
  picker: {
    height: 50
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10
  },
  button: {
    padding: 10
  },
  addBtn: {
    backgroundColor: '#EEF2FF',
    borderRadius: 8
  },
  cancel: {
    color: '#6B7280',
    fontWeight: '600'
  },
  add: {
    color: '#4F46E5',
    fontWeight: 'bold'
  }
});