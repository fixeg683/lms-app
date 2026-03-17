import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform, // Added for Web vs Mobile detection
  ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { supabase } from '../lib/supabase';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('student');
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]); 
  const [selectedId, setSelectedId] = useState('');

  const tabs = ['student', 'class', 'subject'];

  useEffect(() => {
    fetchOptions();
  }, [activeTab]);

  const fetchOptions = async () => {
    setSelectedId('');
    const table = activeTab === 'student' ? 'students' : activeTab === 'class' ? 'classes' : 'subjects';
    const column = activeTab === 'student' ? 'full_name' : 'name';
    
    try {
      const { data, error } = await supabase.from(table).select(`id, ${column}`);
      if (error) throw error;
      setDataList(data || []);
    } catch (err) {
      console.error("Error fetching options:", err.message);
    }
  };

  const generatePDF = async () => {
    if (!selectedId) {
      Alert.alert("Selection Required", `Please select a ${activeTab} from the dropdown.`);
      return;
    }

    setLoading(true);
    try {
      // Nested selection to reach Classes through the Students table
      let query = supabase.from('grades').select(`
        score,
        subjects (name),
        students!inner (
          full_name,
          classes!inner (id, name)
        )
      `);

      if (activeTab === 'student') {
        query = query.eq('student_id', selectedId);
      } else if (activeTab === 'class') {
        query = query.eq('students.class_id', selectedId);
      } else if (activeTab === 'subject') {
        query = query.eq('subject_id', selectedId);
      }

      const { data: reportData, error } = await query;
      if (error) throw error;

      if (!reportData || reportData.length === 0) {
        Alert.alert("No Data", "No grade records found for this selection.");
        setLoading(false);
        return;
      }

      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #1f2937; }
              .header { border-bottom: 2px solid #4f46e5; padding-bottom: 20px; margin-bottom: 30px; }
              h1 { color: #4f46e5; margin: 0; font-size: 28px; }
              .meta { color: #6b7280; font-size: 14px; margin-top: 5px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th { background-color: #f9fafb; text-align: left; padding: 12px; border: 1px solid #e5e7eb; color: #4b5563; font-size: 12px; text-transform: uppercase; }
              td { padding: 12px; border: 1px solid #e5e7eb; font-size: 14px; }
              .score-cell { font-weight: bold; color: #059669; }
              .footer { margin-top: 40px; font-size: 10px; color: #9ca3af; text-align: center; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>EduManage Pro Report</h1>
              <p class="meta">${activeTab.toUpperCase()} Performance Summary</p>
              <p class="meta">Generated: ${new Date().toLocaleDateString()}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Class</th>
                  <th>Subject</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                ${reportData.map(item => `
                  <tr>
                    <td>${item.students?.full_name || 'N/A'}</td>
                    <td>${item.students?.classes?.name || 'N/A'}</td>
                    <td>${item.subjects?.name || 'N/A'}</td>
                    <td class="score-cell">${item.score}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;

      // WEB-SAFE LOGIC
      if (Platform.OS === 'web') {
        // This opens the browser print window where you can select "Save as PDF"
        await Print.printAsync({ html: htmlContent });
      } else {
        // Mobile sharing logic
        const { uri } = await Print.printToFileAsync({ html: htmlContent });
        await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
      }
      
    } catch (err) {
      console.error("PDF Error:", err);
      Alert.alert("Error", "Failed to generate report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reports</Text>
      <Text style={styles.subtitle}>Select a category and target to generate a performance PDF.</Text>

      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === tab ? styles.activeText : styles.inactiveText]}>
              {tab.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Choose {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedId}
            onValueChange={(itemValue) => setSelectedId(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label={`-- Select ${activeTab} --`} value="" />
            {dataList.map((item) => (
              <Picker.Item 
                key={item.id} 
                label={item.full_name || item.name} 
                value={item.id} 
              />
            ))}
          </Picker>
        </View>

        <TouchableOpacity 
          style={[styles.downloadButton, !selectedId && styles.disabledButton]} 
          onPress={generatePDF}
          disabled={loading || !selectedId}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Generate PDF Report</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Reports;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F9FAFB' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827' },
  subtitle: { color: '#6B7280', marginBottom: 25, fontSize: 14 },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 4, marginBottom: 20, borderWidth: 1, borderColor: '#E5E7EB' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: '#EEF2FF' },
  tabText: { fontSize: 11, fontWeight: 'bold' },
  activeText: { color: '#4F46E5' },
  inactiveText: { color: '#9CA3AF' },
  card: { backgroundColor: '#fff', padding: 24, borderRadius: 20, borderWidth: 1, borderColor: '#F3F4F6' },
  label: { fontSize: 12, fontWeight: 'bold', color: '#4B5563', marginBottom: 10, textTransform: 'uppercase' },
  pickerContainer: { backgroundColor: '#F9FAFB', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 24, overflow: 'hidden' },
  picker: { height: 50, width: '100%' },
  downloadButton: { backgroundColor: '#4F46E5', padding: 16, borderRadius: 12, alignItems: 'center' },
  disabledButton: { backgroundColor: '#9CA3AF' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});