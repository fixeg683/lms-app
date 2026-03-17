import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { supabase } from '../lib/supabase';

const AddGradeModal = ({ isOpen, onClose, onRefresh }) => {
  const [studentId, setStudentId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [score, setScore] = useState('');

  const handleAdd = async () => {
    if (!studentId.trim() || !subjectId.trim() || !score.trim()) return;

    try {
      const { error } = await supabase.from('grades').insert([
        { 
          student_id: studentId, 
          subject_id: subjectId, 
          score: parseFloat(score),
          status: 'Locked' 
        },
      ]);

      if (error) throw error;

      setScore('');
      onClose?.();
      onRefresh?.();
    } catch (error) {
      console.error('Add grade error:', error?.message || error);
    }
  };

  return (
    <Modal visible={!!isOpen} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Add New Grade</Text>

          <TextInput
            placeholder="Student UUID"
            value={studentId}
            onChangeText={setStudentId}
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />

          <TextInput
            placeholder="Subject UUID"
            value={subjectId}
            onChangeText={setSubjectId}
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />

          <TextInput
            placeholder="Score (e.g., 85)"
            value={score}
            onChangeText={setScore}
            keyboardType="numeric"
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={styles.button}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleAdd} style={styles.button}>
              <Text style={styles.add}>Add Grade</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddGradeModal;

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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 20 },
  input: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 14,
    color: '#374151',
  },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12, gap: 8 },
  button: { paddingHorizontal: 16, paddingVertical: 10 },
  cancel: { color: '#6B7280', fontWeight: '600', fontSize: 14 },
  add: { color: '#4F46E5', fontWeight: 'bold', fontSize: 14 },
});