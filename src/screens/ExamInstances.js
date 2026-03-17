import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { supabase } from '../lib/supabase';
import AddExamModal from '../components/AddExamModal';
import DeleteModal from '../components/DeleteModal';

const ExamInstances = () => {
  const [exams, setExams] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState({ open: false, id: null, name: '' });

  useEffect(() => { fetchExams(); }, []);

  const fetchExams = async () => {
    try {
      const { data, error } = await supabase.from('exam_instances').select('*');
      if (error) throw error;
      setExams(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch exams error:', error?.message || error);
      setExams([]);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfig?.id) return;
    try {
      const { error } = await supabase.from('exam_instances').delete().eq('id', deleteConfig.id);
      if (error) throw error;
      setDeleteConfig({ open: false, id: null, name: '' });
      fetchExams();
    } catch (error) {
      console.error('Delete error:', error?.message || error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Exam Instances</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setIsAddModalOpen(true)}>
          <Text style={styles.addText}>+ New Exam</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, { flex: 3 }]}>EXAM NAME</Text>
          <Text style={[styles.headerText, { flex: 2 }]}>DATE</Text>
          <Text style={[styles.headerText, { flex: 1, textAlign: 'right' }]}>ACTIONS</Text>
        </View>

        {exams.length === 0 && <Text style={styles.empty}>No exams created yet</Text>}

        {exams.map((exam) => (
          <View key={exam?.id || Math.random()} style={styles.row}>
            <Text style={[styles.cell, { flex: 3, fontWeight: 'bold' }]}>{String(exam?.name || 'Untitled Exam')}</Text>
            <Text style={[styles.cell, { flex: 2, color: '#6B7280' }]}>{String(exam?.date || 'No Date')}</Text>
            <View style={[styles.actions, { flex: 1 }]}>
              <TouchableOpacity><Text style={styles.edit}>✎</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => setDeleteConfig({ open: true, id: exam?.id, name: exam?.name })}>
                <Text style={styles.delete}>🗑</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <AddExamModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onRefresh={fetchExams} />
      <DeleteModal isOpen={deleteConfig.open} onClose={() => setDeleteConfig({ open: false, id: null, name: '' })} onConfirm={handleDelete} itemName={deleteConfig.name} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  addButton: { backgroundColor: '#4F46E5', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 8 },
  addText: { color: '#fff', fontWeight: 'bold' },
  table: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#eee' },
  tableHeader: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderColor: '#eee', backgroundColor: '#F9FAFB' },
  headerText: { fontSize: 12, color: '#9CA3AF', fontWeight: 'bold' },
  row: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderColor: '#eee', alignItems: 'center' },
  cell: { fontSize: 14, color: '#374151' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 15 },
  edit: { color: '#9CA3AF', fontSize: 18 },
  delete: { color: '#EF4444', fontSize: 18 },
  empty: { textAlign: 'center', padding: 30, color: '#9CA3AF' }
});

export default ExamInstances;