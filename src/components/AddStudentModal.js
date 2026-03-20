import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../lib/supabase';

const AddStudentModal = ({ isOpen, onClose, onRefresh }) => {
  const [fullName, setFullName] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [classList, setClassList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch classes so we can assign the student to a real class
  useEffect(() => {
    if (isOpen) fetchClasses();
  }, [isOpen]);

  const fetchClasses = async () => {
    const { data } = await supabase.from('classes').select('name').order('name');
    if (data) setClassList(data);
  };

  const handleAddStudent = async () => {
    if (!fullName.trim() || !selectedClass) {
      Alert.alert('Error', 'Please provide a name and select a class');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('students')
        .insert([{ 
          full_name: fullName.trim(), 
          class: selectedClass 
        }]);

      if (error) throw error;

      setFullName('');
      setSelectedClass('');
      onClose();
      if (onRefresh) onRefresh();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={isOpen} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Register Student</Text>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. John Doe"
            value={fullName}
            onChangeText={setFullName}
          />

          <Text style={styles.label}>Assign to Class</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedClass}
              onValueChange={(itemValue) => setSelectedClass(itemValue)}
            >
              <Picker.Item label="Select a class..." value="" />
              {classList.map((c) => (
                <Picker.Item key={c.name} label={c.name} value={c.name} />
              ))}
            </Picker>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.submitButton, !fullName.trim() && styles.disabled]} 
              onPress={handleAddStudent}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Save Student</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '90%', maxWidth: 400, backgroundColor: '#fff', padding: 25, borderRadius: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, padding: 12, marginBottom: 15 },
  pickerContainer: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, marginBottom: 20, overflow: 'hidden' },
  buttonRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  cancelButton: { padding: 12 },
  cancelText: { color: '#6B7280', fontWeight: '600' },
  submitButton: { backgroundColor: '#4F46E5', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 },
  submitText: { color: '#fff', fontWeight: 'bold' },
  disabled: { backgroundColor: '#9CA3AF' }
});

export default AddStudentModal;