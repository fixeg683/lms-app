import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../lib/supabase';

const EditClassModal = ({ isOpen, onClose, onRefresh, classData }) => {
  const [name, setName] = useState('');
  const [academicYear, setAcademicYear] = useState(''); // ✅ New State
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (classData) {
      setName(classData.name || '');
      setAcademicYear(classData.academic_year || '');
    }
  }, [classData, isOpen]);

  const handleUpdate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('classes')
        .update({ 
          name: name.trim(), 
          academic_year: academicYear.trim() // ✅ Update field
        })
        .eq('id', classData.id);

      if (error) throw error;
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
          <Text style={styles.modalTitle}>Edit Class Details</Text>
          
          <Text style={styles.label}>Class Name</Text>
          <TextInput 
            style={styles.input} 
            value={name} 
            onChangeText={setName} 
            placeholder="e.g. Grade 1 Red"
          />

          <Text style={styles.label}>Academic Year</Text>
          <TextInput 
            style={styles.input} 
            value={academicYear} 
            onChangeText={setAcademicYear} 
            placeholder="e.g. 2025/2026"
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleUpdate} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Save Changes</Text>}
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
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#111827' },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, padding: 12, marginBottom: 15, backgroundColor: '#F9FAFB' },
  buttonRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 10 },
  cancelButton: { padding: 12 },
  cancelText: { color: '#6B7280', fontWeight: '600' },
  submitButton: { backgroundColor: '#4F46E5', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 },
  submitText: { color: '#fff', fontWeight: 'bold' }
});

export default EditClassModal;