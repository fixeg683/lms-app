import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { supabase } from '../lib/supabase';
import AddSubjectModal from '../components/AddSubjectModal';
import DeleteModal from '../components/DeleteModal';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState({ open: false, id: null, name: '' });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase.from('subjects').select('*');
      if (error) throw error;

      setSubjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch subjects error:', error?.message || error);
      setSubjects([]);
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
        <Text style={styles.title}>Subjects</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddModalOpen(true)}
        >
          <Text style={styles.addText}>+ Add Subject</Text>
        </TouchableOpacity>
      </View>

      {/* Table */}
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
          <View key={subject?.id || Math.random()} style={styles.row}>
            <Text style={[styles.cell, { flex: 2 }]}>
              {String(subject?.name || 'Untitled')}
            </Text>

            <Text style={[styles.cell, { flex: 3, color: '#6B7280' }]}>
              {typeof subject?.description === 'string'
                ? subject.description
                : 'No description'}
            </Text>

            <View style={[styles.actions, { flex: 1 }]}>
              <TouchableOpacity>
                <Text style={styles.edit}>✎</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  setDeleteConfig({
                    open: true,
                    id: subject?.id,
                    name: subject?.name || '',
                  })
                }
              >
                <Text style={styles.delete}>🗑</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modals */}
      {AddSubjectModal && (
        <AddSubjectModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onRefresh={fetchSubjects}
        />
      )}

      {DeleteModal && (
        <DeleteModal
          isOpen={deleteConfig.open}
          onClose={() =>
            setDeleteConfig({ open: false, id: null, name: '' })
          }
          onConfirm={handleDelete}
          itemName={deleteConfig.name}
        />
      )}
    </View>
  );
};

export default Subjects;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F9FAFB' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  title: { fontSize: 24, fontWeight: 'bold' },

  addButton: {
    backgroundColor: '#4F46E5',
    padding: 10,
    borderRadius: 8,
  },

  addText: { color: '#fff', fontWeight: 'bold' },

  table: {
    backgroundColor: '#fff',
    borderRadius: 10,
  },

  tableHeader: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },

  headerText: { fontSize: 12, color: '#9CA3AF', fontWeight: 'bold' },

  row: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },

  cell: { fontSize: 14 },

  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  edit: { marginRight: 10, color: '#6B7280' },
  delete: { color: '#EF4444' },

  empty: {
    textAlign: 'center',
    padding: 20,
    color: '#9CA3AF',
  },
});