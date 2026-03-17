import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';

const EditGradeModal = ({ isOpen, onClose, onRefresh, gradeData }) => {
  const [score, setScore] = useState('');
  const [loading, setLoading] = useState(false);

  // Pre-fill the score when the modal opens with a specific grade
  useEffect(() => {
    if (gradeData) {
      setScore(String(gradeData.score));
    }
  }, [gradeData]);

  const handleUpdate = async () => {
    if (!score) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('grades')
        .update({ score: parseFloat(score) })
        .eq('id', gradeData.id);

      if (error) throw error;

      onClose?.();
      onRefresh?.();
    } catch (error) {
      alert('Update error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={!!isOpen} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Edit Grade</Text>
          
          <Text style={styles.infoLabel}>Student: 
            <Text style={styles.infoValue}> {gradeData?.students?.full_name}</Text>
          </Text>
          <Text style={styles.infoLabel}>Subject: 
            <Text style={styles.infoValue}> {gradeData?.subjects?.name}</Text>
          </Text>

          <TextInput
            placeholder="Enter New Score"
            value={score}
            onChangeText={setScore}
            keyboardType="numeric"
            style={styles.input}
          />

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} disabled={loading}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleUpdate} disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="#4F46E5" />
              ) : (
                <Text style={styles.add}>Save Changes</Text>
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
  modal: { width: 320, backgroundColor: '#fff', padding: 24, borderRadius: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  infoLabel: { fontSize: 14, color: '#6B7280', marginBottom: 5 },
  infoValue: { color: '#111827', fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#E5E7EB', padding: 12, borderRadius: 10, marginTop: 15, marginBottom: 20 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 20 },
  cancel: { color: '#6B7280', fontWeight: '600' },
  add: { color: '#4F46E5', fontWeight: 'bold' }
});

export default EditGradeModal;