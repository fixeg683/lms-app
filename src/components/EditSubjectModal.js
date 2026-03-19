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

const EditSubjectModal = ({ isOpen, onClose, onRefresh, subject }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync state with the selected subject
  useEffect(() => {
    if (subject) {
      setName(subject.name || '');
      setDescription(subject.description || '');
    }
  }, [subject, isOpen]);

  const handleUpdateSubject = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Subject name is required');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('subjects')
        .update({
          name: name.trim(),
          description: description.trim(),
        })
        .eq('id', subject.id); // ✅ Updates specific record

      if (error) throw error;

      onClose();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Update subject error:', error.message);
      Alert.alert('Error', 'Could not update subject.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Subject</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Subject Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.submitButton, !name.trim() && styles.disabledButton]} 
              onPress={handleUpdateSubject}
              disabled={loading || !name.trim()}
            >
              {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.submitButtonText}>Save Changes</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Define styles OUTSIDE the component
const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContainer: { width: '100%', maxWidth: 450, backgroundColor: '#fff', borderRadius: 16, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 20 },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, padding: 12, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  buttonRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8, gap: 12 },
  cancelButton: { paddingVertical: 12, paddingHorizontal: 20 },
  cancelButtonText: { color: '#6B7280', fontWeight: '600' },
  submitButton: { backgroundColor: '#4F46E5', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10, minWidth: 140, alignItems: 'center' },
  submitButtonText: { color: '#fff', fontWeight: 'bold' },
  disabledButton: { backgroundColor: '#9CA3AF' }
});

export default EditSubjectModal;