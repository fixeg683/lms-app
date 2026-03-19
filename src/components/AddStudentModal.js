import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator, // Added for better UX
} from 'react-native';
import { supabase } from '../lib/supabase';

const AddStudentModal = ({ isOpen, onClose, onRefresh }) => {
  const [fullName, setFullName] = useState('');
  const [className, setClassName] = useState(''); // New state for Class
  const [loading, setLoading] = useState(false);

  const handleAddStudent = async () => {
    // Basic validation: ensure both fields have text
    if (!fullName.trim() || !className.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('students')
        .insert([
          { 
            full_name: fullName, 
            class: className // Ensure this column name matches your Supabase table
          }
        ]);

      if (error) throw error;

      // Reset form and close
      setFullName('');
      setClassName('');
      onClose?.();
      onRefresh?.();
    } catch (error) {
      console.error('Add student error:', error?.message || error);
      alert('Error adding student: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={!!isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Add New Student</Text>

          <Text style={styles.label}>Student Name</Text>
          <TextInput
            placeholder="e.g. John Doe"
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
          />

          <Text style={styles.label}>Class / Grade</Text>
          <TextInput
            placeholder="e.g. Mathematics 101"
            value={className}
            onChangeText={setClassName}
            style={styles.input}
          />

          <div style={styles.actions}>
            <TouchableOpacity onPress={onClose} disabled={loading}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleAddStudent} 
              disabled={loading || !fullName || !className}
            >
              <Text style={[styles.add, (loading || !fullName || !className) && styles.disabledText]}>
                {loading ? 'Adding...' : 'Add Student'}
              </Text>
            </TouchableOpacity>
          </div>
        </View>
      </View>
    </Modal>
  );
};

export default AddStudentModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#111827',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 20,
  },
  cancel: {
    fontSize: 16,
    color: '#6B7280',
    paddingVertical: 8,
  },
  add: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: 'bold',
    paddingVertical: 8,
  },
  disabledText: {
    color: '#9CA3AF',
  }
});