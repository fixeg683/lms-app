import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../lib/supabase';

const AddClassModal = ({ isOpen, onClose, onRefresh }) => {
  const [className, setClassName] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddClass = async () => {
    if (!className.trim() || !academicYear.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('classes')
        .insert([{ 
          name: className.trim(), 
          academic_year: academicYear.trim() 
        }]);

      if (error) throw error;

      setClassName('');
      setAcademicYear('');
      onClose();
      if (onRefresh) onRefresh();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add New Class</Text>

          <Text style={styles.label}>Class Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Grade 1 Red"
            value={className}
            onChangeText={setClassName}
          />

          <Text style={styles.label}>Academic Year</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 2026/2027"
            value={academicYear}
            onChangeText={setAcademicYear}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.submitButton, (!className.trim() || !academicYear.trim()) && styles.disabled]} 
              onPress={handleAddClass}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Create Class</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: 350, backgroundColor: '#fff', padding: 25, borderRadius: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, padding: 12, marginBottom: 15 },
  buttonRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  cancelButton: { padding: 12 },
  cancelText: { color: '#6B7280', fontWeight: '600' },
  submitButton: { backgroundColor: '#4F46E5', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 },
  submitText: { color: '#fff', fontWeight: 'bold' },
  disabled: { backgroundColor: '#9CA3AF' }
});

export default AddClassModal;