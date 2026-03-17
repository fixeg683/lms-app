import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform
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

    const table =
      activeTab === 'student'
        ? 'students'
        : activeTab === 'class'
        ? 'classes'
        : 'subjects';

    const column = activeTab === 'student' ? 'full_name' : 'name';

    try {
      const { data, error } = await supabase
        .from(table)
        .select(`id, ${column}`);

      if (error) throw error;

      setDataList(data || []);
    } catch (err) {
      console.error('Error fetching options:', err.message);
      Alert.alert('Error', 'Failed to load options.');
    }
  };

  const generatePDF = async () => {
    if (!selectedId) {
      Alert.alert('Selection Required', `Please select a ${activeTab}.`);
      return;
    }

    setLoading(true);

    try {
      // 🔹 Fetch report data
      let query = supabase.from('grades').select(`
        score,
        subjects (name),
        students!inner (
          full_name,
          class_id,
          classes!inner (id, name)
        )
      `);

      if (activeTab === 'student') {
        query = query.eq('student_id', selectedId);
      } else if (activeTab === 'class') {
        query = query.filter('students.class_id', 'eq', selectedId);
      } else if (activeTab === 'subject') {
        query = query.eq('subject_id', selectedId);
      }

      const { data: reportData, error } = await query;

      if (error) throw error;

      if (!reportData || reportData.length === 0) {
        Alert.alert('No Data', 'No grade records found.');
        return;
      }

      // 🔹 Build HTML
      const htmlContent = `
        <html>
          <head>
            <style>
              body {
                font-family: Helvetica, Arial, sans-serif;
                padding: 40px;
                color: #111827;
              }
              .header {
                border-bottom: 2px solid #4F46E5;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              h1 {
                color: #4F46E5;
                margin: 0;
                font-size: 24px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              }
              th {
                background-color: #F9FAFB;
                text-align: left;
                padding: 12px;
                border: 1px solid #E5E7EB;
                font-size: 10px;
                text-transform: uppercase;
                color: #6B7280;
              }
              td {
                padding: 12px;
                border: 1px solid #E5E7EB;
                font-size: 14px;
              }
              .score {
                font-weight: bold;
                color: #059669;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>EduManage Pro - ${activeTab.toUpperCase()} REPORT</h1>
              <p>Date: ${new Date().toLocaleDateString()}</p>
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
                ${reportData
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.students?.full_name || 'N/A'}</td>
                    <td>${item.students?.classes?.name || 'N/A'}</td>
                    <td>${item.subjects?.name || 'N/A'}</td>
                    <td class="score">${item.score ?? 'N/A'}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;

      // 🔹 PLATFORM-SPECIFIC DOWNLOAD
      if (Platform.OS === 'web') {
        // ✅ BEST OPTION: Print dialog (user saves as PDF)
        const printWindow = window.open('', '_blank');

        if (!printWindow) {
          Alert.alert(
            'Popup Blocked',
            'Please allow popups to download the report.'
          );
          return;
        }

        printWindow.document.write(htmlContent);
        printWindow.document.close();

        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
        };
      } else {
        // ✅ MOBILE
        const { uri } = await Print.printToFileAsync({ html: htmlContent });

        await Sharing.shareAsync(uri, {
          UTI: '.pdf',
          mimeType: 'application/pdf'
        });
      }
    } catch (err) {
      console.error('Download Error:', err);
      Alert.alert('Error', 'Failed to generate report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reports</Text>
      <Text style={styles.subtitle}>Generate performance PDF reports</Text>

      {/* Tabs */}
      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab ? styles.activeText : styles.inactiveText
              ]}
            >
              {tab.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.label}>Select {activeTab}</Text>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedId}
            onValueChange={(val) => setSelectedId(val)}
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
          style={[
            styles.btn,
            (!selectedId || loading) && styles.btnDisabled
          ]}
          onPress={generatePDF}
          disabled={!selectedId || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Download PDF</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Reports;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F9FAFB' },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827'
  },

  subtitle: {
    color: '#6B7280',
    marginBottom: 25
  },

  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10
  },

  activeTab: {
    backgroundColor: '#EEF2FF'
  },

  tabText: {
    fontSize: 11,
    fontWeight: 'bold'
  },

  activeText: {
    color: '#4F46E5'
  },

  inactiveText: {
    color: '#9CA3AF'
  },

  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6'
  },

  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4B5563',
    marginBottom: 10
  },

  pickerContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
    overflow: 'hidden'
  },

  picker: {
    height: 50,
    width: '100%'
  },

  btn: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center'
  },

  btnDisabled: {
    backgroundColor: '#9CA3AF'
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});