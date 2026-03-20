import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';

const EditClassModal = ({ isOpen, onClose, onRefresh, classData }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (classData) setName(classData.name);
  }, [classData]);

  const handleUpdate = async () => {
    await supabase.from('classes').update({ name }).eq('id', classData.id);
    onRefresh();
    onClose();
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Edit Class</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose}><Text style={styles.cancel}>Cancel</Text></TouchableOpacity>
            <TouchableOpacity onPress={handleUpdate}><Text style={styles.save}>Save</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modal: { width: 300, backgroundColor: 'white', padding: 20, borderRadius: 12 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8, marginBottom: 20 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 15 },
  cancel: { color: '#666' },
  save: { color: '#4F46E5', fontWeight: 'bold' }
});
export default EditClassModal;