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

const CreateClassModal = ({ isOpen, onClose, onRefresh }) => {
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('classes').insert([
        { name, academic_year: year },
      ]);

      if (error) throw error;

      setName('');
      setYear('');
      onClose?.();
      onRefresh?.();
    } catch (error) {
      console.error('Create class error:', error?.message || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={!!isOpen} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Create Class</Text>

          <TextInput
            placeholder="Class Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TextInput
            placeholder="Academic Year"
            value={year}
            onChangeText={setYear}
            style={styles.input}
          />

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleCreate}>
              <Text style={styles.create}>
                {loading ? 'Creating...' : 'Create'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CreateClassModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modal: {
    width: 320,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },

  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },

  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  cancel: { marginRight: 15, color: '#6B7280' },
  create: { color: '#2563EB', fontWeight: 'bold' },
});