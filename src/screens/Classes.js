import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../lib/supabase';

import AddClassModal from '../components/AddClassModal';
import EditClassModal from '../components/EditClassModal';
import DeleteModal from '../components/DeleteModal'; // ✅ Ensure this is imported

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editConfig, setEditConfig] = useState({ open: false, data: null });
  const [deleteConfig, setDeleteConfig] = useState({ open: false, id: null, name: '' });

  useEffect(() => { fetchClasses(); }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      // ✅ Fetch classes and count related students
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          students:students(count)
        `)
        .order('name');

      if (error) throw error;
      setClasses(data || []);
    } catch (error) {
      console.error('Fetch error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase.from('classes').delete().eq('id', deleteConfig.id);
      if (error) throw error;
      setDeleteConfig({ open: false, id: null, name: '' });
      fetchClasses();
    } catch (error) {
      Alert.alert('Error', 'Cannot delete class with enrolled students.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Classes</Text>
          <Text style={styles.subtitle}>Manage groups and enrollment</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setIsAddModalOpen(true)}>
          <Text style={styles.addText}>+ Add Class</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, { flex: 3 }]}>CLASS NAME</Text>
            <Text style={[styles.headerText, { flex: 2 }]}>ACADEMIC YEAR</Text>
            <Text style={[styles.headerText, { flex: 2 }]}>STUDENTS</Text>
            <Text style={[styles.headerText, { flex: 1, textAlign: 'right' }]}>ACTIONS</Text>
          </View>

          {classes.map((item) => (
            <View key={item.id} style={styles.row}>
              <Text style={[styles.cell, { flex: 3, fontWeight: 'bold' }]}>{item.name}</Text>
              <Text style={[styles.cell, { flex: 2, color: '#6B7280' }]}>{item.academic_year || 'N/A'}</Text>
              
              {/* ✅ Display Student Count */}
              <View style={[styles.cell, { flex: 2 }]}>
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{item.students?.[0]?.count || 0} Enrolled</Text>
                </View>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity onPress={() => setEditConfig({ open: true, data: item })}>
                  <Text style={styles.editIcon}>✎</Text>
                </TouchableOpacity>
                
                {/* ✅ Restored Delete Button */}
                <TouchableOpacity onPress={() => setDeleteConfig({ open: true, id: item.id, name: item.name })}>
                  <Text style={styles.deleteIcon}>🗑</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <AddClassModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onRefresh={fetchClasses} />
      
      <EditClassModal 
        isOpen={editConfig.open} 
        classData={editConfig.data} 
        onClose={() => setEditConfig({ open: false, data: null })} 
        onRefresh={fetchClasses} 
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6B7280' },
  addButton: { backgroundColor: '#4F46E5', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  addText: { color: '#fff', fontWeight: 'bold' },
  table: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', padding: 15, backgroundColor: '#F9FAFB', borderBottomWidth: 1, borderColor: '#E5E7EB' },
  headerText: { fontSize: 12, color: '#9CA3AF', fontWeight: 'bold' },
  row: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderColor: '#F3F4F6', alignItems: 'center' },
  cell: { fontSize: 14, color: '#374151' },
  countBadge: { backgroundColor: '#EEF2FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
  countText: { color: '#4F46E5', fontSize: 12, fontWeight: '600' },
  actions: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end', gap: 15 },
  editIcon: { fontSize: 18, color: '#9CA3AF' },
  deleteIcon: { fontSize: 18, color: '#FCA5A5' }
});

export default Classes;