import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

const Dashboard = ({ route }) => {
  // Same logic as AdminDashboard: detect the active tab from the route
  const currentTab = route.name;

  const renderContent = () => {
    switch (currentTab) {
      case 'MyGrades':
        return (
          <ManagementView 
            title="My Academic Performance" 
            description="View your semester results and GPA breakdown." 
            icon="🎓" 
          />
        );
      case 'Reports':
        return (
          <ManagementView 
            title="Activity Reports" 
            description="Download your attendance and progress summaries." 
            icon="📊" 
          />
        );
      default:
        // Main Dashboard View (Standard Overview)
        return (
          <View style={styles.statsGrid}>
            <StatCard title="Enrolled Courses" value="6" color="#2563EB" icon="📚" />
            <StatCard title="Attendance" value="94%" color="#10B981" icon="📅" />
            <StatCard title="Assignments" value="3" color="#F59E0B" icon="✍️" />
          </View>
        );
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          {currentTab === 'MyGrades' ? 'My Grades' : currentTab}
        </Text>
        <Text style={styles.subText}>EduManage Pro | Personal Learning Portal</Text>
      </View>
      {renderContent()}
    </ScrollView>
  );
};

// Reusable Management View (Matching Admin Format)
const ManagementView = ({ title, description, icon }) => (
  <View style={styles.sectionCard}>
    <View style={styles.sectionHeaderRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={{ fontSize: 24 }}>{icon}</Text>
    </View>
    <Text style={styles.placeholderText}>{description}</Text>
    <View style={styles.tablePlaceholder}>
      <Text style={{ color: '#9CA3AF', fontStyle: 'italic', textAlign: 'center' }}>
        No recent records found in this category.
      </Text>
    </View>
  </View>
);

// Reusable Stat Card (Matching Admin Format)
const StatCard = ({ title, value, color, icon }) => (
  <View style={[styles.card, { borderLeftColor: color, borderLeftWidth: 5 }]}>
    <View>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
    <Text style={styles.cardIcon}>{icon}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContent: { padding: 24 },
  header: { marginBottom: 24 },
  welcomeText: { fontSize: 26, fontWeight: '800', color: '#111827' },
  subText: { fontSize: 13, color: '#6B7280' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    backgroundColor: '#FFF',
    width: Dimensions.get('window').width > 768 ? '31%' : '100%',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowOpacity: 0.05,
    elevation: 3,
  },
  cardValue: { fontSize: 22, fontWeight: '700' },
  cardTitle: { fontSize: 12, color: '#6B7280' },
  cardIcon: { fontSize: 24 },
  sectionCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 30, elevation: 3 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 20, fontWeight: '700' },
  placeholderText: { color: '#6B7280', marginBottom: 20 },
  tablePlaceholder: { 
    padding: 40, 
    borderStyle: 'dashed', 
    borderWidth: 1, 
    borderColor: '#D1D5DB', 
    borderRadius: 8, 
    alignItems: 'center' 
  }
});

export default Dashboard;