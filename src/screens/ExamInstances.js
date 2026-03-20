import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import AddExamModal from '../components/AddExamModal';
import EditExamModal from '../components/EditExamModal'; // ✅ New Import
import DeleteModal from '../components/DeleteModal';

const ExamInstances = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // ✅ State for Edit Modal
  const [editConfig, setEditConfig] = useState({ open: false, data: null });
  const [deleteConfig, setDeleteConfig] = useState({ open: false, id: null, name: '' });

  useEffect(() => { fetchExams(); }, []);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('exam_instances')
        .select('*')
        .order('date', { ascending: false }); // Show newest exams first
      
      if (error) throw error;
      setExams(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch exams error:', error?.message || error);
      setExams([]);
    } finally {
      setLoading(false);
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
        <View>
          <Text style={styles.title}>Exam Instances</Text>
          <Text style={styles.subtitle}>Manage schedules and exam naming</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setIsAddModalOpen(true)}>
          <Text style={styles.addText}>+ New Exam</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, { flex: 3 }]}>EXAM NAME</Text>
            <Text style={[styles.headerText, { flex: 2 }]}>DATE</Text>
            <Text style={[styles.headerText, { flex: 1, textAlign: 'right' }]}>ACTIONS</Text>
          </View>

          {exams.length === 0 && <Text style={styles.empty}>No exams created yet</Text>}

          {exams.map((exam) => (
            <View key={exam.id} style={styles.row}>
              <Text style={[styles.cell, { flex: 3, fontWeight: 'bold' }]}>{exam.name}</Text>
              <Text style={[styles.cell, { flex: 2, color: '#6B7280' }]}>{exam.date}</Text>
              
              <View style={[styles.actions, { flex: 1 }]}>
                {/* ✅ Edit Button now opens the modal */}
                <TouchableOpacity onPress={() => setEditConfig({ open: true, data: exam })}>
                  <Text style={styles.edit}>✎</Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => setDeleteConfig({ open: true, id: exam.id, name: exam.name })}>
                  <Text style={styles.delete}>🗑</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* MODALS */}
      <AddExamModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onRefresh={fetchExams} 
      />

      <EditExamModal 
        isOpen={editConfig.open}
        examData={editConfig.data}
        onClose={() => setEditConfig({ open: false, data: null })}
        onRefresh={fetchExams}
      />

      <DeleteModal 
        isOpen={deleteConfig.open} 
        onClose={() => setDeleteConfig({ open: false, id: null, name: '' })} 
        onConfirm={handleDelete} 
        itemName={deleteConfig.name} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6B7280' },
  addButton: { backgroundColor: '#4F46E5', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 8 },
  addText: { color: '#fff', fontWeight: 'bold' },
  table: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#eee', overflow: 'hidden' },
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