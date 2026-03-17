import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { supabase } from '../lib/supabase';
import CreateClassModal from '../components/CreateClassModal';
import DeleteModal from '../components/DeleteModal';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState({ open: false, id: null, name: '' });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*, students(count)');

      if (error) throw error;

      setClasses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch classes error:', error?.message || error);
      setClasses([]);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfig?.id) return;

    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', deleteConfig.id);

      if (error) throw error;

      setDeleteConfig({ open: false, id: null, name: '' });
      fetchClasses();
    } catch (error) {
      console.error('Delete error:', error?.message || error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Class Management</Text>
          <Text style={styles.subtitle}>Manage classes and student rosters</Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsCreateOpen(true)}
        >
          <Text style={styles.addText}>+ Create Class</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <ScrollView>
        {classes.length === 0 && (
          <Text style={styles.empty}>No classes found</Text>
        )}

        {classes.map((item) => (
          <View key={item?.id || Math.random()} style={styles.card}>
            <Text style={styles.className}>
              {String(item?.name || 'Untitled Class')}
            </Text>

            <Text style={styles.year}>
              Academic Year: {item?.academic_year || 'N/A'}
            </Text>

            <Text style={styles.count}>
              {item?.students?.[0]?.count || 0} students
            </Text>

            <View style={styles.actions}>
              <TouchableOpacity>
                <Text style={styles.edit}>✎</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  setDeleteConfig({
                    open: true,
                    id: item?.id,
                    name: item?.name || '',
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
      {CreateClassModal && (
        <CreateClassModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onRefresh={fetchClasses}
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

export default Classes;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F9FAFB' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  title: { fontSize: 22, fontWeight: 'bold' },
  subtitle: { fontSize: 12, color: '#6B7280' },

  addButton: {
    backgroundColor: '#4F46E5',
    padding: 10,
    borderRadius: 8,
  },

  addText: { color: '#fff', fontWeight: 'bold' },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },

  className: { fontSize: 16, fontWeight: 'bold' },
  year: { color: '#6B7280', marginTop: 5 },
  count: { marginTop: 5, fontWeight: 'bold' },

  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },

  edit: { marginRight: 10, color: '#6B7280' },
  delete: { color: '#EF4444' },

  empty: { textAlign: 'center', marginTop: 20, color: '#9CA3AF' },
});