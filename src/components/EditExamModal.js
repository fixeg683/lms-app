import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../lib/supabase';

const EditExamModal = ({ isOpen, onClose, onRefresh, examData }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (examData) {
      setName(examData.name || '');
      setDate(examData.date || '');
    }
  }, [examData, isOpen]);

  const handleUpdate = async () => {
    if (!name.trim() || !date.trim()) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('exam_instances')
        .update({ name: name.trim(), date: date.trim() })
        .eq('id', examData.id);

      if (error) throw error;

      onClose();
      onRefresh();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Edit Exam Instance</Text>

          <Text style={styles.label}>Exam Name</Text>
          <TextInput 
            style={styles.input} 
            value={name} 
            onChangeText={setName} 
            placeholder="e.g. End of Term 1" 
          />

          <Text style={styles.label}>Date</Text>
          <TextInput 
            style={styles.input} 
            value={date} 
            onChangeText={setDate} 
            placeholder="YYYY-MM-DD" 
          />

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleUpdate} disabled={loading} style={styles.saveBtn}>
              {loading ? (
                <ActivityIndicator color="white" />
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

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modal: { width: '85%', backgroundColor: 'white', padding: 25, borderRadius: 15 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, gap: 15 },
  cancelBtn: { padding: 10 },
  cancelText: { color: '#6B7280', fontWeight: '600' },
  saveBtn: { backgroundColor: '#4F46E5', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
  saveText: { color: 'white', fontWeight: 'bold' }
});

export default EditExamModal;