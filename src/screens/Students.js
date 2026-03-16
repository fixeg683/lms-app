import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator 
} from 'react-native';
import { supabase } from '../lib/supabase';
import AddStudentModal from '../components/AddStudentModal';
import DeleteModal from '../components/DeleteModal';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState({ open: false, id: null, name: '' });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*, classes(name)');
      
      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error("Error fetching students:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', deleteConfig.id);

    if (!error) {
      setDeleteConfig({ open: false, id: null, name: '' });
      fetchStudents();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.title}>Student Management</Text>
          <Text style={styles.subtitle}>Manage student records and information</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setIsAddModalOpen(true)}
        >
          <Text style={styles.addButtonText}>+ Add Student</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView style={styles.tableContainer}>
          {/* Table Header Simulation */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, { flex: 2 }]}>STUDENT</Text>
            <Text style={[styles.headerText, { flex: 1 }]}>CLASS</Text>
            <Text style={[styles.headerText, { flex: 0.5, textAlign: 'right' }]}>ACTIONS</Text>
          </View>

          {/* Table Body */}
          {students.map((student) => (
            <View key={student.id} style={styles.row}>
              <View style={styles.studentCell}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {student.full_name ? student.full_name.substring(0, 2).toUpperCase() : '??'}
                  </Text>
                </View>
                <Text style={styles.studentName}>{student.full_name}</Text>
              </View>

              <View style={styles.classCell}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{student.classes?.name || 'Unassigned'}</Text>
                </View>
              </View>

              <View style={styles.actionCell}>
                <TouchableOpacity onPress={() => console.log('Edit', student.id)}>
                   <Text style={styles.editIcon}>✎</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => setDeleteConfig({ open: true, id: student.id, name: student.full_name })}
                >
                   <Text style={styles.deleteIcon}>🗑</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <AddStudentModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onRefresh={fetchStudents} 
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
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 20 },
  headerContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 24 
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6B7280' },
  addButton: { 
    backgroundColor: '#4F46E5', 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 8,
    elevation: 2
  },
  addButtonText: { color: 'white', fontWeight: 'bold' },
  tableContainer: { backgroundColor: 'white', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#F3F4F6' },
  tableHeader: { 
    flexDirection: 'row', 
    backgroundColor: '#F9FAFB', 
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F3F4F6' 
  },
  headerText: { fontSize: 12, fontWeight: 'bold', color: '#9CA3AF' },
  row: { 
    flexDirection: 'row', 
    padding: 16, 
    alignItems: 'center', 
    borderBottomWidth: 1, 
    borderBottomColor: '#F3F4F6' 
  },
  studentCell: { flex: 2, flexDirection: 'row', alignItems: 'center' },
  avatar: { 
    width: 36, 
    height: 36, 
    borderRadius: 8, 
    backgroundColor: '#EEF2FF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 12 
  },
  avatarText: { color: '#4F46E5', fontWeight: 'bold', fontSize: 12 },
  studentName: { fontSize: 14, fontWeight: '600', color: '#374151' },
  classCell: { flex: 1 },
  badge: { 
    backgroundColor: '#EFF6FF', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 12, 
    alignSelf: 'flex-start' 
  },
  badgeText: { color: '#2563EB', fontSize: 10, fontWeight: 'bold' },
  actionCell: { flex: 0.5, flexDirection: 'row', justifyContent: 'flex-end', gap: 15 },
  editIcon: { color: '#9CA3AF', fontSize: 18 },
  deleteIcon: { color: '#FCA5A5', fontSize: 18 }
});

export default Students;