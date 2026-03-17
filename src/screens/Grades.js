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
import AddGradeModal from '../components/AddGradeModal';
import EditGradeModal from '../components/EditGradeModal';
import DeleteModal from '../components/DeleteModal';

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [deleteConfig, setDeleteConfig] = useState({ open: false, id: null, name: '' });

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    setLoading(true);
    try {
      // We select the student and subject names via foreign key relationships
      const { data, error } = await supabase
        .from('grades')
        .select(`
          id,
          score,
          status,
          students (full_name),
          subjects (name)
        `);

      if (error) throw error;
      setGrades(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch grades error:', error?.message || error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfig?.id) return;

    try {
      const { error } = await supabase
        .from('grades')
        .delete()
        .eq('id', deleteConfig.id);

      if (error) throw error;

      setDeleteConfig({ open: false, id: null, name: '' });
      fetchGrades();
    } catch (error) {
      console.error('Delete error:', error?.message || error);
    }
  };

  const handleEditPress = (grade) => {
    setSelectedGrade(grade);
    setIsEditModalOpen(true);
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Grades</Text>
          <Text style={styles.subtitle}>View and manage all grade records</Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddModalOpen(true)}
        >
          <Text style={styles.addText}>+ Add Grade</Text>
        </TouchableOpacity>
      </View>

      {/* Table Section */}
      <View style={styles.tableWrapper}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, { flex: 2 }]}>STUDENT</Text>
          <Text style={[styles.headerText, { flex: 1.5 }]}>SUBJECT</Text>
          <Text style={[styles.headerText, { flex: 1, textAlign: 'center' }]}>SCORE</Text>
          <Text style={[styles.headerText, { flex: 1, textAlign: 'right' }]}>ACTIONS</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#4F46E5" style={{ margin: 40 }} />
        ) : (
          <ScrollView>
            {grades.length === 0 ? (
              <Text style={styles.empty}>No grade records found.</Text>
            ) : (
              grades.map((grade) => (
                <View key={grade.id} style={styles.row}>
                  <Text style={[styles.cell, { flex: 2, fontWeight: 'bold' }]}>
                    {grade.students?.full_name || 'Unknown'}
                  </Text>
                  
                  <Text style={[styles.cell, { flex: 1.5, color: '#6366F1' }]}>
                    {grade.subjects?.name || 'N/A'}
                  </Text>
                  
                  <View style={[styles.cell, { flex: 1, alignItems: 'center' }]}>
                    <View style={styles.scoreBadge}>
                      <Text style={styles.scoreText}>{grade.score}</Text>
                    </View>
                  </View>

                  <View style={[styles.actions, { flex: 1 }]}>
                    <TouchableOpacity onPress={() => handleEditPress(grade)}>
                      <Text style={styles.editIcon}>✎</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        setDeleteConfig({
                          open: true,
                          id: grade.id,
                          name: `record for ${grade.students?.full_name}`,
                        })
                      }
                    >
                      <Text style={styles.deleteIcon}>🗑</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}
      </View>

      {/* Modals Container */}
      <AddGradeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onRefresh={fetchGrades}
      />

      <EditGradeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onRefresh={fetchGrades}
        gradeData={selectedGrade}
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

export default Grades;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: { fontSize: 26, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6B7280' },
  addButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 2,
  },
  addText: { color: '#fff', fontWeight: 'bold' },
  tableWrapper: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    flex: 1,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerText: { fontSize: 12, color: '#9CA3AF', fontWeight: 'bold' },
  row: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    alignItems: 'center',
  },
  cell: { fontSize: 14, color: '#374151' },
  scoreBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scoreText: { color: '#059669', fontWeight: 'bold', fontSize: 13 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15,
  },
  editIcon: { color: '#9CA3AF', fontSize: 18 },
  deleteIcon: { color: '#EF4444', fontSize: 18 },
  empty: {
    textAlign: 'center',
    padding: 40,
    color: '#9CA3AF',
    fontSize: 14,
  },
});