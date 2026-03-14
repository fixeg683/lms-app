import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const AdminDashboard = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome, Administrator</Text>
        <Text style={styles.subText}>EduManage Pro | Exam Management</Text>
        
        {/* You can add Stats Cards here later (Total Students, Exams, etc.) */}
        <View style={styles.placeholderCard}>
          <Text style={styles.cardText}>Admin Statistics Content Area</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 24 },
  welcomeText: { fontSize: 28, fontWeight: '700', color: '#111827' },
  subText: { fontSize: 16, color: '#6B7280', marginBottom: 20 },
  placeholderCard: {
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed'
  },
  cardText: { color: '#9CA3AF' }
});

export default AdminDashboard;