import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  Alert // Added for error feedback
} from 'react-native';
import { supabase } from '../lib/supabase';
import AddStudentModal from '../components/AddStudentModal';
import EditStudentModal from '../components/EditStudentModal'; // Added this
import DeleteModal from '../components/DeleteModal';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Added state for Editing
  const [editConfig, setEditConfig] = useState({ open: false, student: null });
  const [deleteConfig, setDeleteConfig] = useState({ open: false, id: null, name: '' });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Updated query to fetch the direct 'class' column we added
      const { data, error } = await supabase
        .from('students')
        .select('*') 
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching students:", error?.message || error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfig?.id) return;
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', deleteConfig.id);

      if (error) throw error;
      setDeleteConfig({ open: false, id: null, name: '' });
      fetchStudents();
    } catch (error) {
      Alert.alert("Error", error.message);
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
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, { flex: 2 }]}>STUDENT</Text>
            <Text style={[styles.headerText, { flex: 1 }]}>CLASS</Text>
            <Text style={[styles.headerText, { flex: 0.5, textAlign: 'right' }]}>ACTIONS</Text>
          </View>

          {students.map((student) => {
            const initials = student?.full_name
              ? student.full_name.substring(0, 2).toUpperCase()
              : '??';

            return (
              <View key={student.id} style={styles.row}> 
                <View style={styles.studentCell}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{initials}</Text>
                  </View>
                  <Text style={styles.studentName}>{student.full_name}</Text>
                </View>

                <View style={styles.classCell}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {/* Changed from student.classes.name to student.class */}
                      {student.class || 'Unassigned'}
                    </Text>
                  </View>
                </View>

                <View style={styles.actionCell}>
                  <TouchableOpacity
                    onPress={() => setEditConfig({ open: true, student })}
                  >
                    <Text style={styles.editIcon}>✎</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      setDeleteConfig({
                        open: true,
                        id: student.id,
                        name: student.full_name,
                      })
                    }
                  >
                    <Text style={styles.deleteIcon}>🗑</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* MODALS */}
      <AddStudentModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onRefresh={fetchStudents} 
      />

      <EditStudentModal 
        isOpen={editConfig.open}
        student={editConfig.student}
        onClose={() => setEditConfig({ open: false, student: null })}
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

// ... styles remain the same
export default Students;