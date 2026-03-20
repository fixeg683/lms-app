import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../lib/supabase';

const AddClassModal = ({ isOpen, onClose, onRefresh }) => {
  const [className, setClassName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddClass = async () => {
    if (!className.trim()) {
      Alert.alert('Error', 'Please enter a class name');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from('classes').insert([{ name: className.trim() }]);
      if (error) throw error;
      setClassName('');
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
          <TextInput
            style={styles.input}
            placeholder="e.g. Grade 1 Red"
            value={className}
            onChangeText={setClassName}
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.submitButton, !className.trim() && styles.disabled]} 
              onPress={handleAddClass}
              disabled={loading || !className.trim()}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Create</Text>}
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
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, padding: 12, marginBottom: 20 },
  buttonRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  cancelButton: { padding: 12 },
  cancelText: { color: '#6B7280', fontWeight: '600' },
  submitButton: { backgroundColor: '#4F46E5', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 },
  submitText: { color: '#fff', fontWeight: 'bold' },
  disabled: { backgroundColor: '#9CA3AF' }
});

export default AddClassModal;