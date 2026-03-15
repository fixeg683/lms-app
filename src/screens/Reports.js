import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Reports = () => {
  const reportTypes = [
    { title: 'Student Performance', icon: 'account-chart' },
    { title: 'Attendance Summary', icon: 'calendar-check' },
    { title: 'Financial Overview', icon: 'cash-register' },
  ];

  return (
    <View style={styles.container}>
      {reportTypes.map((report, index) => (
        <TouchableOpacity key={index} style={styles.reportRow}>
          <MaterialCommunityIcons name={report.icon} size={24} color="#2563EB" />
          <Text style={styles.reportText}>{report.title}</Text>
          <MaterialCommunityIcons name="download" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  reportRow: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, marginBottom: 15, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  reportText: { flex: 1, marginLeft: 15, fontSize: 16, fontWeight: '600' }
});

export default Reports;