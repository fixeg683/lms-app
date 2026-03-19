import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../lib/supabase';

const EditStudentModal = ({ isOpen, onClose, onRefresh, student }) => {
  const [fullName, setFullName] = useState('');
  const [className, setClassName] = useState('');
  const [loading, setLoading] = useState(false);

  // Pre-fill the form when the student prop changes or modal opens
  useEffect(() => {
    if (student) {
      setFullName(student.full_name || '');
      setClassName(student.class || '');
    }
  }, [student, isOpen]);

  const handleUpdateStudent = async () => {
    if (!fullName.trim() || !className.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('students')
        .update({ 
          full_name: fullName, 
          class: className 
        })
        .eq('id', student.id); // Ensure we only update this specific student

      if (error) throw error;

      onClose?.();
      onRefresh?.();
    } catch (error) {
      console.error('Update student error:', error?.message || error);
      alert('Failed to update student. Please try again.');
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
          <Text style={styles.title}>Edit Student Details</Text>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            placeholder="Student Name"
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
          />

          <Text style={styles.label}>Class / Grade</Text>
          <TextInput
            placeholder="e.g. Grade 5"
            value={className}
            onChangeText={setClassName}
            style={styles.input}
          />

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} disabled={loading} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleUpdateStudent} 
              disabled={loading}
              style={[styles.saveBtn, loading && styles.disabledBtn]}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.saveText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditStudentModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#111827',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    color: '#111827',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  cancelText: {
    color: '#6B7280',
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  saveText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disabledBtn: {
    backgroundColor: '#93C5FD',
  }
});