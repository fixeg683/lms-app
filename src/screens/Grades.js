import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { supabase } from '../lib/supabase';
import AddGradeModal from '../components/AddGradeModal';
import DeleteModal from '../components/DeleteModal';

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState({ open: false, id: null, name: '' });

  useEffect(() => { fetchGrades(); }, []);

  const fetchGrades = async () => {
    try {
      const { data, error } = await supabase
        .from('grades')
        .select('*, students(full_name), subjects(name)');
      if (error) throw error;
      setGrades(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch grades error:', error?.message || error);
      setGrades([]);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfig?.id) return;
    try {
      const { error } = await supabase.from('grades').delete().eq('id', deleteConfig.id);
      if (error) throw error;
      setDeleteConfig({ open: false, id: null, name: '' });
      fetchGrades();
    } catch (error) {
      console.error('Delete error:', error?.message || error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Grades</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setIsAddModalOpen(true)}>
          <Text style={styles.addText}>+ Add Grade</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, { flex: 2 }]}>STUDENT</Text>
          <Text style={[styles.headerText, { flex: 1.5 }]}>SUBJECT</Text>
          <Text style={[styles.headerText, { flex: 0.8, textAlign: 'center' }]}>SCORE</Text>
          <Text style={[styles.headerText, { flex: 1, textAlign: 'right' }]}>ACTIONS</Text>
        </View>

        {grades.length === 0 && <Text style={styles.empty}>No grades found</Text>}

        {grades.map((grade) => (
          <View key={grade?.id || Math.random()} style={styles.row}>
            <Text style={[styles.cell, { flex: 2, fontWeight: 'bold' }]}>
              {String(grade?.students?.full_name || 'Unknown')}
            </Text>
            <Text style={[styles.cell, { flex: 1.5, color: '#4F46E5' }]}>
              {String(grade?.subjects?.name || 'N/A')}
            </Text>
            <Text style={[styles.cell, { flex: 0.8, textAlign: 'center', fontWeight: 'bold', color: '#10B981' }]}>
              {String(grade?.score || 0)}
            </Text>
            <View style={[styles.actions, { flex: 1 }]}>
              <TouchableOpacity><Text style={styles.edit}>✎</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => setDeleteConfig({ open: true, id: grade?.id, name: `Grade for ${grade?.students?.full_name}` })}>
                <Text style={styles.delete}>🗑</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <AddGradeModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onRefresh={fetchGrades} />
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

export default Grades;