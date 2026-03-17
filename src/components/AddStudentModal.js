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

const AddStudentModal = ({ isOpen, onClose, onRefresh }) => {
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddStudent = async () => {
    if (!fullName.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('students')
        .insert([{ full_name: fullName }]);

      if (error) throw error;

      setFullName('');
      onClose?.();
      onRefresh?.();
    } catch (error) {
      console.error('Add student error:', error?.message || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={!!isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Add Student</Text>

          <TextInput
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
          />

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleAddStudent} disabled={loading}>
              <Text style={styles.add}>
                {loading ? 'Adding...' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddStudentModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: 320,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancel: {
    marginRight: 20,
    color: '#6B7280',
  },
  add: {
    color: '#2563EB',
    fontWeight: 'bold',
  },
});