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
      // ✅ We let Supabase handle the ID generation automatically
      const newUser = {
        username: username.trim(),
        role: role
      };

      const { error } = await supabase
        .from('profiles')
        .insert([newUser]);

      if (error) {
        // Handle duplicate username error
        if (error.code === '23505') {
          throw new Error('This username is already taken.');
        }
        throw error;
      }

      // ✅ Success Reset
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

          <Text style={styles.label}>Username</Text>
          <TextInput
            placeholder="e.g. johndoe"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Assign Role</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={role}
              onValueChange={(itemValue) => setRole(itemValue)}
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
    backgroundColor: 'rgba(17, 24, 39, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#111827', 
    marginBottom: 20 
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 8,
    textTransform: 'uppercase'
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    color: '#111827',
  },
  pickerContainer: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden'
  },
  picker: {
    height: 50,
    width: '100%',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12
  },
  button: { 
    paddingHorizontal: 20, 
    paddingVertical: 12,
    borderRadius: 10
  },
  addBtn: {
    backgroundColor: '#EEF2FF',
  },
  cancel: { 
    color: '#6B7280', 
    fontWeight: '600',
    alignSelf: 'center'
  },
  add: { 
    color: '#4F46E5', 
    fontWeight: 'bold',
    alignSelf: 'center'
  },
});