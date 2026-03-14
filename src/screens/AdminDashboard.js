import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Dimensions 
} from 'react-native';

const AdminDashboard = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, Administrator</Text>
        <Text style={styles.subText}>EduManage Pro | Exam Management Overview</Text>
      </View>

      {/* Statistics Cards Grid */}
      <View style={styles.statsGrid}>
        <StatCard title="Total Students" value="1,240" color="#2563EB" icon="👥" />
        <StatCard title="Active Courses" value="48" color="#10B981" icon="📚" />
        <StatCard title="Pending Exams" value="12" color="#F59E0B" icon="✍️" />
        <StatCard title="Reports Generated" value="89" color="#7C3AED" icon="📊" />
      </View>

      {/* Recent Activity Table */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Recent System Activity</Text>
        <ActivityItem user="John Doe" action="Registered as Student" time="2 mins ago" />
        <ActivityItem user="Admin" action="Updated Mathematics Syllabus" time="1 hour ago" />
        <ActivityItem user="Jane Smith" action="Submitted Grade Report" time="3 hours ago" />
      </View>
    </ScrollView>
  );
};

// Sub-component for individual Stat Cards
const StatCard = ({ title, value, color, icon }) => (
  <View style={[styles.card, { borderLeftColor: color, borderLeftWidth: 5 }]}>
    <View style={styles.cardInfo}>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
    <Text style={styles.cardIcon}>{icon}</Text>
  </View>
);

// Sub-component for Activity Rows
const ActivityItem = ({ user, action, time }) => (
  <View style={styles.activityRow}>
    <View>
      <Text style={styles.activityUser}>{user}</Text>
      <Text style={styles.activityAction}>{action}</Text>
    </View>
    <Text style={styles.activityTime}>{time}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContent: { padding: 24 },
  header: { marginBottom: 24 },
  welcomeText: { fontSize: 28, fontWeight: '800', color: '#111827' },
  subText: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  statsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },
  card: {
    backgroundColor: '#FFF',
    // Responsive width: 4 cards on web, 2 on mobile
    width: Dimensions.get('window').width > 768 ? '23%' : '48%',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardValue: { fontSize: 22, fontWeight: '700', color: '#111827' },
  cardTitle: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  cardIcon: { fontSize: 24 },
  sectionCard: { 
    backgroundColor: '#FFF', 
    borderRadius: 12, 
    padding: 20, 
    marginTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 16 },
  activityRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F3F4F6' 
  },
  activityUser: { fontWeight: '600', color: '#374151' },
  activityAction: { fontSize: 13, color: '#6B7280' },
  activityTime: { fontSize: 12, color: '#9CA3AF' }
});

export default AdminDashboard;