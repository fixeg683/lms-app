import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { supabase } from '../lib/supabase';

const AddGradeModal = ({ isOpen, onClose, onRefresh }) => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [score, setScore] = useState('');
  const [comments, setComments] = useState(''); // ✅ Added Comments State
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      const { data: st } = await supabase.from('students').select('id, full_name').order('full_name');
      const { data: sb } = await supabase.from('subjects').select('id, name').order('name');
      setStudents(st || []);
      setSubjects(sb || []);
    } catch (error) {
      console.error("Fetch error:", error);
    }
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
          comments: comments.trim(), // ✅ Saving comments
          status: 'Locked' 
        },
      ]);

      if (error) throw error;

      setScore('');
      setComments('');
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

          {/* ✅ Added Comments Input */}
          <Text style={styles.label}>Teacher Comments</Text>
          <TextInput
            placeholder="Provide feedback..."
            value={comments}
            onChangeText={setComments}
            multiline
            numberOfLines={3}
            style={[styles.input, styles.textArea]}
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
  modal: { width: '100%', maxWidth: 360, backgroundColor: '#FFFFFF', padding: 24, borderRadius: 20, shadowColor: '#000', elevation: 10 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 20 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#6B7280', marginBottom: 4, marginLeft: 4 },
  input: { width: '100%', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#F3F4F6', padding: 14, borderRadius: 12, marginBottom: 12, fontSize: 14, color: '#374151' },
  textArea: { height: 80, textAlignVertical: 'top' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12, gap: 8 },
  button: { paddingHorizontal: 16, paddingVertical: 10 },
  cancel: { color: '#6B7280', fontWeight: '600', fontSize: 14 },
  add: { color: '#4F46E5', fontWeight: 'bold', fontSize: 14 },
});

export default AddGradeModal;