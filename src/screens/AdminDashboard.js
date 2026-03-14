import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { supabase } from '../lib/supabase';

const AdminDashboard = ({ route }) => {
  // We can use the route name from the Navigator to change content
  const activeTab = route.name || 'Dashboard';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, Administrator</Text>
        <Text style={styles.breadcrumb}>EduManage Pro | {activeTab}</Text>
      </View>

      {/* Dynamic Content Area */}
      {activeTab === 'Dashboard' ? (
        <View style={styles.statsGrid}>
          <StatCard title="Total Students" value="1,240" color="#2563EB" icon="👥" />
          <StatCard title="Active Courses" value="48" color="#10B981" icon="📚" />
          <StatCard title="Pending Grades" value="12" color="#F59E0B" icon="📝" />
          <StatCard title="System Reports" value="5" color="#6B7280" icon="📊" />
        </View>
      ) : (
        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderText}>
            Management view for {activeTab} is loading...
          </Text>
        </View>
      )}

      {/* Recent Activity Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityRow}>
          <Text style={styles.activityLabel}>New Student Registered</Text>
          <Text style={styles.activityTime}>2 mins ago</Text>
        </View>
        <View style={styles.activityRow}>
          <Text style={styles.activityLabel}>Grade Report Exported</Text>
          <Text style={styles.activityTime}>1 hour ago</Text>
        </View>
      </View>
    </ScrollView>
  );
};

// Sub-component for Stats
const StatCard = ({ title, value, color, icon }) => (
  <View style={[styles.card, { borderLeftColor: color, borderLeftWidth: 4 }]}>
    <Text style={styles.cardIcon}>{icon}</Text>
    <View>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 24 },
  header: { marginBottom: 30 },
  welcomeText: { fontSize: 24, fontWeight: '700', color: '#111827' },
  breadcrumb: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  statsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },
  card: {
    backgroundColor: '#FFF',
    width: Dimensions.get('window').width > 800 ? '23%' : '48%',
    padding: 20,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardIcon: { fontSize: 24, marginRight: 15 },
  cardValue: { fontSize: 20, fontWeight: '700', color: '#111827' },
  cardTitle: { fontSize: 12, color: '#6B7280' },
  section: { marginTop: 20, backgroundColor: '#FFF', padding: 20, borderRadius: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15 },
  activityRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F3F4F6' 
  },
  placeholderCard: { padding: 100, alignItems: 'center', backgroundColor: '#FFF', borderRadius: 8 },
  placeholderText: { color: '#9CA3AF' }
});

export default AdminDashboard;