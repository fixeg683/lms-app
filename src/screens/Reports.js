import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { supabase } from '../lib/supabase';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('student');
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]); // List of students, classes, or subjects
  const [selectedId, setSelectedId] = useState('');

  const tabs = ['student', 'class', 'subject'];

  useEffect(() => {
    fetchOptions();
  }, [activeTab]);

  const fetchOptions = async () => {
    setSelectedId('');
    const table = activeTab === 'student' ? 'students' : activeTab === 'class' ? 'classes' : 'subjects';
    const column = activeTab === 'student' ? 'full_name' : 'name';
    
    const { data } = await supabase.from(table).select(`id, ${column}`);
    setDataList(data || []);
  };

  const generatePDF = async () => {
    if (!selectedId) {
      Alert.alert("Error", `Please select a ${activeTab} first.`);
      return;
    }

    setLoading(true);
    try {
      // 1. Fetch Grade Data based on Selection
      let query = supabase.from('grades').select(`
        score,
        students (full_name),
        subjects (name),
        classes!inner (name)
      `);

      if (activeTab === 'student') query = query.eq('student_id', selectedId);
      if (activeTab === 'class') query = query.eq('classes.id', selectedId);
      if (activeTab === 'subject') query = query.eq('subject_id', selectedId);

      const { data: reportData, error } = await query;
      if (error) throw error;

      // 2. Build HTML Template
      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: 'Helvetica', sans-serif; padding: 20px; }
              h1 { color: #4F46E5; text-align: center; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #E5E7EB; padding: 12px; text-align: left; }
              th { backgroundColor: #F9FAFB; color: #6B7280; }
              .header { margin-bottom: 30px; border-bottom: 2px solid #4F46E5; padding-bottom: 10px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>EduManage Pro - ${activeTab.toUpperCase()} REPORT</h1>
              <p>Date: ${new Date().toLocaleDateString()}</p>
            </div>
            <table>
              <tr>
                <th>Student</th>
                <th>Subject</th>
                <th>Score</th>
              </tr>
              ${reportData.map(item => `
                <tr>
                  <td>${item.students?.full_name}</td>
                  <td>${item.subjects?.name}</td>
                  <td><b>${item.score}</b></td>
                </tr>
              `).join('')}
            </table>
          </body>
        </html>
      `;

      // 3. Generate and Share PDF
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
      
    } catch (err) {
      Alert.alert("Export Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reports</Text>
      <Text style={styles.subtitle}>Generate and download PDF performance reports</Text>

      {/* Tab Switcher */}
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
        <Text style={styles.label}>Select {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedId}
            onValueChange={(itemValue) => setSelectedId(itemValue)}
          >
            <Picker.Item label={`Choose a ${activeTab}...`} value="" color="#9CA3AF" />
            {dataList.map((item) => (
              <Picker.Item key={item.id} label={item.full_name || item.name} value={item.id} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity 
          style={styles.downloadButton} 
          onPress={generatePDF}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>📄 Download PDF Report</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Reports;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F9FAFB' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#111827' },
  subtitle: { color: '#6B7280', marginBottom: 25 },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 5, marginBottom: 20, borderWidth: 1, borderColor: '#F3F4F6' },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  activeTab: { backgroundColor: '#EEF2FF' },
  tabText: { fontSize: 12, fontWeight: 'bold' },
  activeText: { color: '#4F46E5' },
  inactiveText: { color: '#9CA3AF' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 16, elevation: 2, borderWidth: 1, borderColor: '#F3F4F6' },
  label: { fontSize: 12, fontWeight: 'bold', color: '#374151', marginBottom: 8 },
  pickerWrapper: { backgroundColor: '#F9FAFB', borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 20 },
  downloadButton: { backgroundColor: '#4F46E5', padding: 15, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});