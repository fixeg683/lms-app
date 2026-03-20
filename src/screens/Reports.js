import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../lib/supabase';

// ✅ CRITICAL: Using curly braces for NAMED exports from your utils
import { fetchAndVerifyStudentReportData } from '../utils/gradeCalculations';
import { fetchAndVerifyClassReportData } from '../utils/classGradeCalculations';
import { generateReportHTML } from '../utils/reportTemplate';
import { generateClassReportHTML } from '../utils/classReportTemplate';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  
  const iframeRef = useRef(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [stuRes, clsRes] = await Promise.all([
        supabase.from('students').select('id, full_name').order('full_name'),
        supabase.from('classes').select('name').order('name')
      ]);
      setStudents(stuRes.data || []);
      setClasses(clsRes.data || []);
    } catch (error) {
      console.error("Error loading options:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateStudentReport = async () => {
    if (!selectedStudent) {
      alert("Please select a student.");
      return;
    }

    setGenerating(true);
    const currentYear = new Date().getFullYear();

    try {
      // ✅ Calling the named function
      const studentReportData = await fetchAndVerifyStudentReportData(selectedStudent, currentYear);
      const finalHTML = generateReportHTML(studentReportData);
      
      if (Platform.OS === 'web') {
        printToIframe(finalHTML);
      }
    } catch (error) {
      alert("Report Error: " + error.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateClassReport = async () => {
    if (!selectedClass) {
      alert("Please select a class.");
      return;
    }

    setGenerating(true);
    const currentYear = new Date().getFullYear();

    try {
      const classReportData = await fetchAndVerifyClassReportData(selectedClass, currentYear);
      const finalHTML = generateClassReportHTML(classReportData);
      
      if (Platform.OS === 'web') {
        printToIframe(finalHTML);
      }
    } catch (error) {
      alert("Class Report Error: " + error.message);
    } finally {
      setGenerating(false);
    }
  };

  const printToIframe = (html) => {
    if (!iframeRef.current) return;
    const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(html);
    iframeDoc.close();
    
    setTimeout(() => {
      iframeRef.current.contentWindow.focus();
      iframeRef.current.contentWindow.print();
    }, 500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Academic Reports</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView style={styles.scrollContainer} contentContainerStyle={{ gap: 24 }}>
          
          {/* Class Report Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Class Performance Report</Text>
            <Text style={styles.cardSubtitle}>Summarized ranking for the entire class.</Text>
            <View style={styles.pickerWrap}>
              <Picker selectedValue={selectedClass} onValueChange={setSelectedClass}>
                <Picker.Item label="Select Class..." value="" />
                {classes.map((c) => <Picker.Item key={c.name} label={c.name} value={c.name} />)}
              </Picker>
            </View>
            <TouchableOpacity 
              style={[styles.generateBtn, !selectedClass && styles.disabled]} 
              onPress={handleGenerateClassReport}
              disabled={generating || !selectedClass}
            >
              <Text style={styles.generateText}>{generating ? 'Processing...' : 'Generate Class Report'}</Text>
            </TouchableOpacity>
          </View>

          {/* Student Report Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Individual Student Report</Text>
            <Text style={styles.cardSubtitle}>Full progress form for a single learner.</Text>
            <View style={styles.pickerWrap}>
              <Picker selectedValue={selectedStudent} onValueChange={setSelectedStudent}>
                <Picker.Item label="Select Student..." value="" />
                {students.map((s) => <Picker.Item key={s.id} label={s.full_name} value={s.id} />)}
              </Picker>
            </View>
            <TouchableOpacity 
              style={[styles.generateBtn, !selectedStudent && styles.disabled]} 
              onPress={handleGenerateStudentReport}
              disabled={generating || !selectedStudent}
            >
              <Text style={styles.generateText}>{generating ? 'Processing...' : 'Generate Student Report'}</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      )}

      {/* Hidden Print Frame */}
      <iframe
        ref={iframeRef}
        style={{ width: 0, height: 0, border: 'none', position: 'absolute', visibility: 'hidden' }}
        title="Print Frame"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 24 },
  scrollContainer: { flex: 1 },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 25, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, borderWidth: 1, borderColor: '#e5e7eb' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  cardSubtitle: { fontSize: 13, color: '#6B7280', marginBottom: 20 },
  pickerWrap: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, marginBottom: 20, backgroundColor: '#F9FAFB' },
  generateBtn: { backgroundColor: '#4F46E5', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  disabled: { backgroundColor: '#9CA3AF' },
  generateText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default Reports;