import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { Picker } from '@react-native-picker/picker';

// A placeholder AddGradeModal. It needs to be created or integrated.
import AddGradeModal from '../components/AddGradeModal';

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);

  // Filter States
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchGrades();
  }, [selectedClass, selectedStudent, selectedSubject]);

  const fetchInitialData = async () => {
    try {
      const [classRes, subjectRes, studentRes] = await Promise.all([
        supabase.from('classes').select('id, name').order('name'),
        supabase.from('subjects').select('id, name').order('name'),
        supabase.from('students').select('id, full_name').order('full_name'),
      ]);

      if (classRes.error) throw classRes.error;
      if (subjectRes.error) throw subjectRes.error;
      if (studentRes.error) throw studentRes.error;

      setClasses(classRes.data || []);
      setSubjects(subjectRes.data || []);
      setStudents(studentRes.data || []);
    } catch (error) {
      console.error('Initial Fetch Error:', error);
    }
  };

  const fetchGrades = async () => {
    setLoading(true);
    try {
      // ✅ Fetch full relationship data
      let query = supabase.from('grades').select(`
        id,
        score,
        created_at,
        student_id,
        subject_id,
        subjects ( name ),
        students ( full_name, class )
      `);

      // Filter logic
      if (selectedStudent !== 'all') {
        query = query.eq('student_id', selectedStudent);
      }
      if (selectedSubject !== 'all') {
        query = query.eq('subject_id', selectedSubject);
      }
      // Class filtering is tricky if 'class' is just text, but here's a guess:
      if (selectedClass !== 'all') {
        query = query.eq('students.class', selectedClass);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setGrades(data || []);
    } catch (error) {
      console.error('Grade Fetch Error:', error);
      setGrades([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format Rubric and Points based on score
  const getPerformanceData = (score) => {
    if (score >= 90) return { rubric: 'EE 1', points: '8pts', color: '#10B981', rubricBg: '#D1FAE5', barColor: '#10B981' }; // Bright Green
    if (score >= 80) return { rubric: 'EE 2', points: '7pts', color: '#10B981', rubricBg: '#D1FAE5', barColor: '#10B981' }; // Green
    if (score >= 70) return { rubric: 'ME 1', points: '6pts', color: '#3B82F6', rubricBg: '#DBEAFE', barColor: '#3B82F6' }; // Blue
    if (score >= 50) return { rubric: 'ME 2', points: '5pts', color: '#3B82F6', rubricBg: '#DBEAFE', barColor: '#3B82F6' }; // Light Blue
    return { rubric: 'BE 1', points: '4pts', color: '#EF4444', rubricBg: '#FEE2E2', barColor: '#EF4444' }; // Red (Below Expectations)
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Grades</Text>
          <Text style={styles.subtitle}>View and manage all grade records</Text>
        </View>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setIsAddModalOpen(true)}
        >
          <Text style={styles.addButtonText}>+ Add Grade</Text>
        </TouchableOpacity>
      </View>

      {/* --- Filter Section (New!) --- */}
      <View style={styles.filterSection}>
        <View style={styles.filterCard}>
          <Text style={styles.filterLabel}>Class</Text>
          <Picker
            selectedValue={selectedClass}
            onValueChange={(itemValue) => setSelectedClass(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="All Classes" value="all" />
            {classes.map(c => <Picker.Item key={c.id} label={c.name} value={c.name} />)}
          </Picker>
        </View>

        <View style={styles.filterCard}>
          <Text style={styles.filterLabel}>Student</Text>
          <Picker
            selectedValue={selectedStudent}
            onValueChange={(itemValue) => setSelectedStudent(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="All Students" value="all" />
            {students.map(s => <Picker.Item key={s.id} label={s.full_name} value={s.id} />)}
          </Picker>
        </View>

        <View style={styles.filterCard}>
          <Text style={styles.filterLabel}>Subject</Text>
          <Picker
            selectedValue={selectedSubject}
            onValueChange={(itemValue) => setSelectedSubject(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="All Subjects" value="all" />
            {subjects.map(s => <Picker.Item key={s.id} label={s.name} value={s.id} />)}
          </Picker>
        </View>
      </View>

      {/* --- Main Table Section --- */}
      {loading ? (
        <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, styles.colStudent]}>STUDENT</Text>
            <Text style={[styles.headerText, styles.colSubject]}>SUBJECT</Text>
            <Text style={[styles.headerText, styles.colScore]}>SCORE</Text>
            <Text style={[styles.headerText, styles.colRubric]}>RUBRIC</Text>
            <Text style={[styles.headerText, styles.colPoints]}>POINTS</Text>
            <Text style={[styles.headerText, styles.colDate]}>DATE</Text>
            <Text style={[styles.headerText, styles.colStatus]}>STATUS</Text>
            <Text style={[styles.headerText, styles.colActions, { textAlign: 'center' }]}>ACTIONS</Text>
          </View>

          {grades.length === 0 && (
            <Text style={styles.empty}>No grade records found</Text>
          )}

          {grades.map((grade) => {
            const perf = getPerformanceData(grade.score);
            const formattedDate = grade.created_at ? new Date(grade.created_at).toISOString().split('T')[0] : '??';

            return (
              <View key={grade.id} style={styles.row}>
                <Text style={[styles.cellText, styles.colStudent, styles.bold]}>
                  {grade.students?.full_name || 'Unnamed'}
                </Text>

                <View style={[styles.colSubject]}>
                  <Text style={[styles.subjectBadge, { color: grade.subjects?.name === 'Mathematics' ? '#EC4899' : '#C084FC' }]}>
                    {grade.subjects?.name || 'Untitled'}
                  </Text>
                </View>

                {/* --- Score Column with Bar --- */}
                <View style={[styles.colScore, { flexDirection: 'row', alignItems: 'center' }]}>
                  <View style={[styles.scoreBar, { backgroundColor: perf.barColor, width: `${(grade.score / 100) * 100}%` }]} />
                  <Text style={[styles.scoreText, styles.bold, { color: perf.color }]}>{grade.score}</Text>
                </View>

                {/* --- Rubric Badge Column --- */}
                <View style={[styles.colRubric]}>
                  <View style={[styles.rubricBadge, { backgroundColor: perf.rubricBg }]}>
                    <Text style={[styles.rubricText, styles.bold, { color: perf.color }]}>{perf.rubric}</Text>
                  </View>
                </View>

                <Text style={[styles.cellText, styles.colPoints, styles.bold]}>{perf.points}</Text>
                <Text style={[styles.cellText, styles.colDate]}>{formattedDate}</Text>

                {/* --- Status Badge Column --- */}
                <View style={[styles.colStatus]}>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusIcon}>🔒</Text> 
                    <Text style={styles.statusText}>Locked</Text>
                  </View>
                </View>

                {/* --- Actions Column --- */}
                <View style={[styles.actions, styles.colActions]}>
                  <TouchableOpacity onPress={() => console.log('Edit', grade.id)} style={styles.iconBtn}>
                    <Text style={styles.editIcon}>✎</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => console.log('Delete', grade.id)} style={styles.iconBtn}>
                    <Text style={styles.deleteIcon}>🗑</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* Placeholder for Modals (Need integration) */}
      <AddGradeModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onRefresh={fetchGrades} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#F9FAFB', fontFamily: 'Inter' },
  
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 32 
  },
  title: { fontSize: 32, fontWeight: '700', color: '#111827' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 4 },
  
  addButton: { 
    backgroundColor: '#4F46E5', // Indigo
    paddingHorizontal: 20, 
    paddingVertical: 12, 
    borderRadius: 8,
    elevation: 2,
  },
  addButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  // Filter Styles
  filterSection: { 
    flexDirection: 'row', 
    gap: 16, 
    marginBottom: 32 
  },
  filterCard: { 
    flex: 1, 
    backgroundColor: 'white', 
    padding: 16, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterLabel: { fontSize: 14, color: '#6B7280', marginBottom: 8, fontWeight: '500' },
  picker: { width: '100%', height: 40, borderBottomWidth: 0 },

  // Main Table Styles
  table: { 
    backgroundColor: 'white', 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  tableHeader: { 
    flexDirection: 'row', 
    paddingVertical: 20, 
    paddingHorizontal: 15,
    borderBottomWidth: 1, 
    borderBottomColor: '#E5E7EB',
  },
  headerText: { fontSize: 13, color: '#9CA3AF', fontWeight: '600', letterSpacing: 0.5 },
  
  row: { 
    flexDirection: 'row', 
    paddingVertical: 16, 
    paddingHorizontal: 15,
    alignItems: 'center', 
    borderBottomWidth: 1, 
    borderBottomColor: '#F3F4F6' 
  },
  cellText: { fontSize: 15, color: '#374151' },
  bold: { fontWeight: '600' },
  empty: { textAlign: 'center', padding: 40, color: '#9CA3AF' },

  // Column Widths (New!)
  colStudent: { flex: 3 },
  colSubject: { flex: 2.5 },
  colScore: { flex: 2, alignItems: 'flex-start' },
  colRubric: { flex: 1.5 },
  colPoints: { flex: 1.2 },
  colDate: { flex: 2 },
  colStatus: { flex: 1.8 },
  colActions: { flex: 1.2 },

  // Specialized Cell Styles
  subjectBadge: {
    fontSize: 14,
    fontWeight: '600',
  },
  scoreText: { marginLeft: 10, fontSize: 16 },
  scoreBar: { 
    height: 6, 
    borderRadius: 3, 
    minWidth: 5,
  },
  rubricBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    alignSelf: 'flex-start'
  },
  rubricText: { fontSize: 13 },
  
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2', // Light Red
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start'
  },
  statusIcon: { color: '#B91C1C', marginRight: 6, fontSize: 14 },
  statusText: { color: '#B91C1C', fontWeight: 'bold', fontSize: 13 },

  actions: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    gap: 8 
  },
  iconBtn: { padding: 8 },
  editIcon: { color: '#9CA3AF', fontSize: 20 },
  deleteIcon: { color: '#FCA5A5', fontSize: 20 }
});

export default Grades;