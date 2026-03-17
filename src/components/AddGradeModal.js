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
import { Picker } from '@react-native-picker/picker'; // Optional: Use a picker or custom list
import { supabase } from '../lib/supabase';

const AddGradeModal = ({ isOpen, onClose, onRefresh }) => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [score, setScore] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch lists whenever modal opens
  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    const { data: st } = await supabase.from('students').select('id, full_name');
    const { data: sb } = await supabase.from('subjects').select('id, name');
    setStudents(st || []);
    setSubjects(sb || []);
  };

  const handleAdd = async () => {
    if (!selectedStudent || !selectedSubject || !score.trim()) {
      alert("Please select a student, subject, and enter a score.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('grades').insert([
        { 
          student_id: selectedStudent, 
          subject_id: selectedSubject, 
          score: parseFloat(score),
          status: 'Locked' 
        },
      ]);

      if (error) throw error;

      setScore('');
      setSelectedStudent('');
      setSelectedSubject('');
      onClose?.();
      onRefresh?.();
    } catch (error) {
      alert('Add grade error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={!!isOpen} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Add New Grade</Text>

          {/* Simple Dropdown Logic using HTML Pickers for Web compatibility */}
          <Text style={styles.label}>Student</Text>
          <select 
            style={webStyles.select}
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            <option value="">Select Student</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
          </select>

          <Text style={styles.label}>Subject</Text>
          <select 
            style={webStyles.select}
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">Select Subject</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>

          <Text style={styles.label}>Score</Text>
          <TextInput
            placeholder="e.g. 85"
            value={score}
            onChangeText={setScore}
            keyboardType="numeric"
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={styles.button} disabled={loading}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleAdd} style={styles.button} disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="#4F46E5" />
              ) : (
                <Text style={styles.add}>Add Grade</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Web-specific styles for the <select> tag if you are on React Native Web
const webStyles = {
  select: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    border: '1px solid #F3F4F6',
    padding: '12px',
    borderRadius: '12px',
    marginBottom: '12px',
    fontSize: '14px',
    color: '#374151',
    outline: 'none',
  }
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(17, 24, 39, 0.4)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modal: { width: '100%', maxWidth: 340, backgroundColor: '#FFFFFF', padding: 24, borderRadius: 20, shadowColor: '#000', elevation: 10 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 20 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#6B7280', marginBottom: 4, marginLeft: 4 },
  input: { width: '100%', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#F3F4F6', padding: 14, borderRadius: 12, marginBottom: 12, fontSize: 14, color: '#374151' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12, gap: 8 },
  button: { paddingHorizontal: 16, paddingVertical: 10 },
  cancel: { color: '#6B7280', fontWeight: '600', fontSize: 14 },
  add: { color: '#4F46E5', fontWeight: 'bold', fontSize: 14 },
});

export default AddGradeModal;