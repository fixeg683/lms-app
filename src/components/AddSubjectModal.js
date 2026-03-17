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

const AddSubjectModal = ({ isOpen, onClose, onRefresh }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = async () => {
    if (!name.trim()) return;

    try {
      const { error } = await supabase.from('subjects').insert([
        { name, description },
      ]);

      if (error) throw error;

      setName('');
      setDescription('');
      onClose?.();
      onRefresh?.();
    } catch (error) {
      console.error('Add subject error:', error?.message || error);
    }
  };

  return (
    <Modal visible={!!isOpen} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Add Subject</Text>

          <TextInput
            placeholder="Subject Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
          />

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleAdd}>
              <Text style={styles.add}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddSubjectModal;

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
  add: { color: '#2563EB', fontWeight: 'bold' },
});