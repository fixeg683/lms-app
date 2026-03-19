import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator, // Added for better UX
} from 'react-native';
import { supabase } from '../lib/supabase';
import AddSubjectModal from '../components/AddSubjectModal';
import EditSubjectModal from '../components/EditSubjectModal'; // ✅ Added
import DeleteModal from '../components/DeleteModal';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Added loading state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // ✅ Added state for Editing
  const [editConfig, setEditConfig] = useState({ open: false, subject: null });
  const [deleteConfig, setDeleteConfig] = useState({ open: false, id: null, name: '' });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name', { ascending: true }); // ✅ Keeps list alphabetical

      if (error) throw error;

      setSubjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch subjects error:', error?.message || error);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfig?.id) return;

    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', deleteConfig.id);

      if (error) throw error;

      setDeleteConfig({ open: false, id: null, name: '' });
      fetchSubjects();
    } catch (error) {
      console.error('Delete error:', error?.message || error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Subjects</Text>
          <Text style={styles.subtitle}>Manage school curriculum and course details</Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddModalOpen(true)}
        >
          <Text style={styles.addText}>+ Add Subject</Text>
        </TouchableOpacity>
      </View>

      {/* Table Content */}
      {loading ? (
        <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, { flex: 2 }]}>NAME</Text>
            <Text style={[styles.headerText, { flex: 3 }]}>DESCRIPTION</Text>
            <Text style={[styles.headerText, { flex: 1, textAlign: 'right' }]}>ACTIONS</Text>
          </View>

          {subjects.length === 0 && (
            <Text style={styles.empty}>No subjects found</Text>
          )}

          {subjects.map((subject) => (
            <View key={subject.id} style={styles.row}>
              <Text style={[styles.cell, { flex: 2, fontWeight: '600' }]}>
                {subject.name || 'Untitled'}
              </Text>

              <Text style={[styles.cell, { flex: 3, color: '#6B7280' }]} numberOfLines={1}>
                {subject.description || 'No description provided'}
              </Text>

              <View style={[styles.actions, { flex: 1 }]}>
                {/* ✅ Edit Button now works */}
                <TouchableOpacity 
                  onPress={() => setEditConfig({ open: true, subject })}
                >
                  <Text style={styles.edit}>✎</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    setDeleteConfig({
                      open: true,
                      id: subject.id,
                      name: subject.name || '',
                    })
                  }
                >
                  <Text style={styles.delete}>🗑</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Modals */}
      <AddStudentModal // Note: Double check if your component is named AddSubjectModal or AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onRefresh={fetchSubjects}
      />

      {/* ✅ Added EditSubjectModal */}
      <EditSubjectModal
        isOpen={editConfig.open}
        subject={editConfig.subject}
        onClose={() => setEditConfig({ open: false, subject: null })}
        onRefresh={fetchSubjects}
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

export default Subjects;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  addButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 2,
  },
  addText: { color: '#fff', fontWeight: 'bold' },
  table: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  headerText: { fontSize: 12, color: '#9CA3AF', fontWeight: 'bold', letterSpacing: 0.5 },
  row: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  cell: { fontSize: 14, color: '#374151' },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15,
  },
  edit: { fontSize: 18, color: '#9CA3AF' },
  delete: { fontSize: 18, color: '#FCA5A5' },
  empty: {
    textAlign: 'center',
    padding: 40,
    color: '#9CA3AF',
    fontSize: 16,
  },
});