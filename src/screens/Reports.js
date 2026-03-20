import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Assumes library is installed
import { supabase } from '../lib/supabase';

// Utility Imports for both Student and Class reports
import { generateReportHTML } from '../utils/reportTemplate';
import { fetchAndVerifyStudentReportData } from '../utils/gradeCalculations';
import { generateClassReportHTML } from '../utils/classReportTemplate'; // ✅ Added Class Template
import { fetchAndVerifyClassReportData } from '../utils/classGradeCalculations'; // ✅ Added Class Logic

const Reports = () => {
  // Common states
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  
  // Selection states
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  
  // A reference to the hidden iframe used for printing on web
  const iframeRef = useRef(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    // Parallel fetch for students and classes lists
    const [stuRes, clsRes] = await Promise.all([
      supabase.from('students').select('id, full_name').order('full_name'),
      supabase.from('classes').select('name').order('name')
    ]);
    setStudents(stuRes.data || []);
    setClasses(clsRes.data || []);
    setLoading(false);
  };

  // ✅ New Logic to handle Class Report Generation
  const handleGenerateClassReport = async () => {
    if (!selectedClass) {
      alert("Please select a class from the dropdown.");
      return;
    }

    setGenerating(true);
    const currentYear = new Date().getFullYear();

    try {
      // 1. Fetch and process aggregated data for the entire class
      const classReportData = await fetchAndVerifyClassReportData(selectedClass, currentYear);
      
      // 2. Generate the HTML based on the Class Performance format from image_2.png
      const finalHTML = generateClassReportHTML(classReportData);
      
      // 3. Trigger printing behavior (web-only logic)
      if (Platform.OS === 'web') {
        const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(finalHTML);
        iframeDoc.close();
        
        iframeRef.current.contentWindow.focus();
        iframeRef.current.contentWindow.print();
      } else {
        alert("Printing is only supported on the web platform currently.");
      }

    } catch (error) {
      alert(error.message);
    } finally {
      setGenerating(false);
    }
  };

  // Logic to handle individual Student Report Generation (from previous update)
  const handleGenerateStudentReport = async () => {
    if (!selectedStudent) {
      alert("Please select a student from the dropdown.");
      return;
    }

    setGenerating(true);
    const currentYear = new Date().getFullYear();

    try {
      const studentReportData = await fetchAndVerifyStudentReportData(selectedStudent, currentYear);
      const finalHTML = generateReportHTML(studentReportData);
      
      if (Platform.OS === 'web') {
        const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(finalHTML);
        iframeDoc.close();
        
        iframeRef.current.contentWindow.focus();
        iframeRef.current.contentWindow.print();
      }

    } catch (error) {
      alert(error.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Academic Reports</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView style={styles.scrollContainer} contentContainerStyle={{ gap: 24 }}>
          
          {/* ✅ New Class Performance Report Section */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Class Performance Report</Text>
            <Text style={styles.cardSubtitle}>Generate a summative ranking report for an entire class.</Text>
            
            <Text style={styles.label}>Select Class</Text>
            <View style={styles.pickerWrap}>
              <Picker
                selectedValue={selectedClass}
                onValueChange={(itemValue) => setSelectedClass(itemValue)}
              >
                <Picker.Item label="Choose class..." value="" />
                {classes.map((c) => (
                  <Picker.Item key={c.name} label={c.name} value={c.name} />
                ))}
              </Picker>
            </View>

            <TouchableOpacity 
              style={[styles.generateBtn, !selectedClass && styles.btnDisabled]} 
              onPress={handleGenerateClassReport}
              disabled={generating || !selectedClass}
            >
              {generating ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.generateText}>Generate Class Report</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Individual Student Report Section (existing) */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Individual Student Report</Text>
            <Text style={styles.cardSubtitle}>Generate a progress report form for a specific learner.</Text>
            
            <Text style={styles.label}>Select Student</Text>
            <View style={styles.pickerWrap}>
              <Picker
                selectedValue={selectedStudent}
                onValueChange={(itemValue) => setSelectedStudent(itemValue)}
              >
                <Picker.Item label="Choose student..." value="" />
                {students.map((s) => (
                  <Picker.Item key={s.id} label={s.full_name} value={s.id} />
                ))}
              </Picker>
            </View>

            <TouchableOpacity 
              style={[styles.generateBtn, !selectedStudent && styles.btnDisabled]} 
              onPress={handleGenerateStudentReport}
              disabled={generating || !selectedStudent}
            >
              {generating ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.generateText}>Generate Student Report</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* A hidden iframe for injecting the printable HTML (web-only) */}
      {Platform.OS === 'web' && (
        <iframe
          ref={iframeRef}
          style={{ width: 0, height: 0, border: 'none', position: 'absolute', visibility: 'hidden' }}
          title="Print Frame"
        />
      )}
    </View>
  );
};

// Common Styles for the Reports Screen
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 24 },
  scrollContainer: { flex: 1 },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 25, shadowColor: '#eee', elevation: 2, borderWidth: 1, borderColor: '#e5e7eb' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 6 },
  cardSubtitle: { fontSize: 13, color: '#6B7280', marginBottom: 20, lineHeight: 1.4 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 6 },
  pickerWrap: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, marginBottom: 20, backgroundColor: '#fff' },
  generateBtn: { backgroundColor: '#4F46E5', paddingVertical: 14, borderRadius: 10, alignItems: 'center', transition: 'background-color 0.2s' },
  btnDisabled: { backgroundColor: '#9CA3AF' },
  generateText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default Reports;