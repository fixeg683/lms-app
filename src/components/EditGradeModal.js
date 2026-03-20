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

const EditGradeModal = ({ isOpen, onClose, onRefresh, gradeData }) => {
  const [score, setScore] = useState('');
  const [comments, setComments] = useState(''); // ✅ Added Comments State
  const [loading, setLoading] = useState(false);

  // Pre-fill the score and comments when the modal opens
  useEffect(() => {
    if (gradeData) {
      setScore(String(gradeData.score || ''));
      setComments(gradeData.comments || ''); // ✅ Load existing comments
    }
  }, [gradeData, isOpen]);

  const handleUpdate = async () => {
    if (!score) {
      Alert.alert("Error", "Score is required.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('grades')
        .update({ 
          score: parseFloat(score),
          comments: comments.trim() // ✅ Save updated comments
        })
        .eq('id', gradeData.id);

      if (error) throw error;

      onClose?.();
      onRefresh?.();
    } catch (error) {
      Alert.alert('Update error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={!!isOpen} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Edit Grade</Text>
          
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Student: 
              <Text style={styles.infoValue}> {gradeData?.students?.full_name}</Text>
            </Text>
            <Text style={styles.infoLabel}>Subject: 
              <Text style={styles.infoValue}> {gradeData?.subjects?.name}</Text>
            </Text>
          </View>

          <Text style={styles.label}>Score</Text>
          <TextInput
            placeholder="Enter Score"
            value={score}
            onChangeText={setScore}
            keyboardType="numeric"
            style={styles.input}
          />

          {/* ✅ Added Comments Input */}
          <Text style={styles.label}>Teacher Comments</Text>
          <TextInput
            placeholder="Update feedback..."
            value={comments}
            onChangeText={setComments}
            multiline
            numberOfLines={4}
            style={[styles.input, styles.textArea]}
            placeholderTextColor="#9CA3AF"
          />

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} disabled={loading} style={styles.button}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleUpdate} disabled={loading} style={styles.saveBtn}>
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
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
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(17, 24, 39, 0.4)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  modal: { 
    width: '100%', 
    maxWidth: 360, 
    backgroundColor: '#fff', 
    padding: 24, 
    borderRadius: 20, 
    elevation: 10 
  },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#111827', 
    marginBottom: 20 
  },
  infoBox: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6'
  },
  infoLabel: { fontSize: 13, color: '#6B7280', marginBottom: 4 },
  infoValue: { color: '#111827', fontWeight: '600' },
  label: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: '#6B7280', 
    marginBottom: 6, 
    marginLeft: 4 
  },
  input: { 
    width: '100%', 
    backgroundColor: '#F9FAFB', 
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    padding: 14, 
    borderRadius: 12, 
    marginBottom: 16, 
    fontSize: 15, 
    color: '#374151' 
  },
  textArea: { 
    height: 100, 
    textAlignVertical: 'top' 
  },
  actions: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    gap: 12,
    marginTop: 8 
  },
  button: { padding: 10 },
  saveBtn: { 
    backgroundColor: '#4F46E5', 
    paddingHorizontal: 20, 
    paddingVertical: 12, 
    borderRadius: 12 
  },
  cancel: { color: '#6B7280', fontWeight: '600', fontSize: 14 },
  saveText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});

export default EditGradeModal;