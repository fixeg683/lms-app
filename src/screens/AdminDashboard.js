import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

const AdminDashboard = ({ route }) => {
  // Use the route name to show different views
  const currentTab = route.name;

  const renderContent = () => {
    switch (currentTab) {
      case 'Students':
        return <ManagementView title="Student Management" description="View and edit student enrollment records." />;
      case 'Subjects':
        return <ManagementView title="Curriculum / Subjects" description="Manage course subjects and syllabi." />;
      case 'Grades':
        return <ManagementView title="Grade Center" description="Input and verify student marks." />;
      case 'Users':
        return <ManagementView title="System Users" description="Manage accounts for Teachers and Admins." />;
      case 'ExamInstances':
        return <ManagementView title="Exam Instances" description="Schedule and monitor active examinations." />;
      case 'Reports':
        return <ManagementView title="Academic Reports" description="Generate performance analytics." />;
      default:
        return (
          <View style={styles.statsGrid}>
            <StatCard title="Total Students" value="1,240" color="#2563EB" icon="👥" />
            <StatCard title="Active Courses" value="48" color="#10B981" icon="📚" />
            <StatCard title="Reports Pending" value="7" color="#F59E0B" icon="📑" />
          </View>
        );
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Admin: {currentTab}</Text>
        <Text style={styles.subText}>EduManage Pro | Secure Management Panel</Text>
      </View>
      {renderContent()}
    </ScrollView>
  );
};

// Sub-components
const ManagementView = ({ title, description }) => (
  <View style={styles.sectionCard}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.placeholderText}>{description}</Text>
    {/* You can add your Supabase FlatList here later */}
  </View>
);

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
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 10 },
  placeholderText: { color: '#9CA3AF' }
});

export default AdminDashboard;