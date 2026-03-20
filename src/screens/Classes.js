import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { supabase } from '../lib/supabase';

// Component Imports
import AddClassModal from '../components/AddClassModal';
import EditClassModal from '../components/EditClassModal';
import DeleteModal from '../components/DeleteModal';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal Configurations
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editConfig, setEditConfig] = useState({ open: false, data: null });
  const [deleteConfig, setDeleteConfig] = useState({ open: false, id: null, name: '' });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      // 1. Fetch the base classes
      const { data: classesData, error: classError } = await supabase
        .from('classes')
        .select('*')
        .order('name', { ascending: true });

      if (classError) throw classError;

      // 2. Fetch student counts for each class 
      // We map through classes and get a count of students where student.class matches class.name
      const enrichedClasses = await Promise.all(
        classesData.map(async (cls) => {
          const { count, error: countError } = await supabase
            .from('students')
            .select('*', { count: 'exact', head: true })
            .eq('class', cls.name); // Using class name as the link

          if (countError) console.error(`Count error for ${cls.name}:`, countError);
          
          return {
            ...cls,
            studentCount: count || 0,
          };
        })
      );

      setClasses(enrichedClasses);
    } catch (error) {
      console.error('Fetch Classes Error:', error.message);
      Alert.alert('Error', 'Failed to load classes.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfig.id) return;

    try {
      // Check if class has students before deleting (Safeguard)
      const targetClass = classes.find(c => c.id === deleteConfig.id);
      if (targetClass && targetClass.studentCount > 0) {
        Alert.alert('Action Denied', 'You cannot delete a class that has enrolled students. Move the students first.');
        setDeleteConfig({ open: false, id: null, name: '' });
        return;
      }

      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', deleteConfig.id);

      if (error) throw error;

      setDeleteConfig({ open: false, id: null, name: '' });
      fetchClasses();
    } catch (error) {
      console.error('Delete Error:', error.message);
      Alert.alert('Error', 'Could not delete the class.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Classes</Text>
          <Text style={styles.subtitle}>Manage academic groups and enrollment counts</Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddModalOpen(true)}
        >
          <Text style={styles.addText}>+ Add Class</Text>
        </TouchableOpacity>
      </View>

      {/* Classes Table */}
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

          {classes.length === 0 && (
            <Text style={styles.empty}>No classes found. Add one to get started.</Text>
          )}

          {classes.map((item) => (
            <View key={item.id} style={styles.row}>
              <Text style={[styles.cell, { flex: 3, fontWeight: 'bold' }]}>
                {item.name}
              </Text>

              <Text style={[styles.cell, { flex: 2, color: '#6B7280' }]}>
                {item.academic_year || 'Not Set'}
              </Text>

              <View style={[styles.cell, { flex: 2 }]}>
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{item.studentCount} Enrolled</Text>
                </View>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity 
                  onPress={() => setEditConfig({ open: true, data: item })}
                  style={styles.actionBtn}
                >
                  <Text style={styles.editIcon}>✎</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => setDeleteConfig({ open: true, id: item.id, name: item.name })}
                  style={styles.actionBtn}
                >
                  <Text style={styles.deleteIcon}>🗑</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* --- Modals --- */}
      <AddClassModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onRefresh={fetchClasses}
      />

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
  container: { flex: 1, padding: 24, backgroundColor: '#F9FAFB' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 24 
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  addButton: { 
    backgroundColor: '#4F46E5', 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 8,
    elevation: 2 
  },
  addText: { color: '#fff', fontWeight: 'bold' },
  
  table: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#E5E7EB',
    overflow: 'hidden'
  },
  tableHeader: { 
    flexDirection: 'row', 
    padding: 15, 
    backgroundColor: '#F9FAFB', 
    borderBottomWidth: 1, 
    borderColor: '#E5E7EB' 
  },
  headerText: { fontSize: 12, color: '#9CA3AF', fontWeight: 'bold', letterSpacing: 0.5 },
  
  row: { 
    flexDirection: 'row', 
    padding: 15, 
    alignItems: 'center', 
    borderBottomWidth: 1, 
    borderColor: '#F3F4F6' 
  },
  cell: { fontSize: 15, color: '#374151' },
  
  countBadge: { 
    backgroundColor: '#EEF2FF', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 20,
    alignSelf: 'flex-start'
  },
  countText: { color: '#4F46E5', fontSize: 12, fontWeight: '700' },
  
  actions: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  actionBtn: { padding: 5 },
  editIcon: { fontSize: 20, color: '#9CA3AF' },
  deleteIcon: { fontSize: 20, color: '#FCA5A5' },
  
  empty: { textAlign: 'center', padding: 40, color: '#9CA3AF', fontSize: 16 }
});

export default Classes;