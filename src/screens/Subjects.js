import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../lib/supabase';
import AddSubjectModal from '../components/AddSubjectModal'; // ✅ Corrected import
import EditSubjectModal from '../components/EditSubjectModal';
import DeleteModal from '../components/DeleteModal';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
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
        .order('name', { ascending: true });

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
                <TouchableOpacity onPress={() => setEditConfig({ open: true, subject })}>
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

      {/* ✅ FIX: Changed AddStudentModal to AddSubjectModal */}
      <AddSubjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onRefresh={fetchSubjects}
      />

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

// ... Styles remain the same

export default Subjects;