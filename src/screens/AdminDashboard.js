import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const AdminDashboard = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>
      <Text style={styles.subHeader}>Overview of your exam management system</Text>

      {/* Summary Cards */}
      <View style={styles.grid}>
        <Card title="Total Students" value="4" icon="👥" color="#2563EB" />
        <Card title="Total Subjects" value="8" icon="🟣" color="#7C3AED" />
        <Card title="Grades Entered" value="6" icon="🟢" color="#059669" />
        <Card title="Average Score" value="75%" icon="🟡" color="#D97706" />
      </View>

      <View style={styles.contentLayout}>
        {/* Grade Distribution */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Grade Distribution</Text>
          <DistItem label="Approaching (AE)" count="0" percent="0" color="#FB923C" />
          <DistItem label="Below (BE)" count="0" percent="0" color="#F87171" />
          <DistItem label="Exceeding (EE)" count="4" percent="67" color="#22C55E" />
          <DistItem label="Meeting (ME)" count="2" percent="33" color="#3B82F6" />
        </View>

        {/* Top Performers */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Top Performers</Text>
          <Performer rank="1" name="sammy" grade="EE 2" color="#FACC15" />
          <Performer rank="2" name="viola faith" grade="EE 2" color="#D1D5DB" />
          <Performer rank="3" name="rowlands onyango" grade="EE 2" color="#FDBA74" />
        </View>
      </View>
    </ScrollView>
  );
};

// Internal Sub-components
const Card = ({ title, value, icon, color }) => (
  <View style={styles.statCard}>
    <View>
      <Text style={styles.statLabel}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
    <Text style={[styles.icon, { color }]}>{icon}</Text>
  </View>
);

const DistItem = ({ label, count, percent, color }) => (
  <View style={{ marginBottom: 15 }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
      <Text style={styles.smallLabel}>{label}</Text>
      <Text style={styles.smallLabel}>{count} ({percent}%)</Text>
    </View>
    <View style={styles.progressBarBg}>
      <View style={[styles.progressBarFill, { width: `${percent}%`, backgroundColor: color }]} />
    </View>
  </View>
);

const Performer = ({ rank, name, grade, color }) => (
  <View style={styles.performerRow}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={[styles.rankCircle, { backgroundColor: color }]}>
        <Text style={styles.rankText}>{rank}</Text>
      </View>
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.nameText}>{name}</Text>
        <Text style={styles.classText}>grade 8 red</Text>
      </View>
    </View>
    <View style={styles.gradeBadge}>
      <Text style={styles.gradeText}>{grade}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  subHeader: { fontSize: 14, color: '#6B7280', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { backgroundColor: 'white', padding: 15, borderRadius: 12, width: '48%', marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#F3F4F6' },
  statLabel: { fontSize: 10, fontWeight: 'bold', color: '#9CA3AF' },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: '#F3F4F6' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginBottom: 15 },
  smallLabel: { fontSize: 10, fontWeight: 'bold', color: '#9CA3AF' },
  progressBarBg: { height: 8, backgroundColor: '#F3F4F6', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%' },
  performerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  rankCircle: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  rankText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  nameText: { fontSize: 14, fontWeight: 'bold', color: '#1F2937' },
  classText: { fontSize: 10, color: '#9CA3AF' },
  gradeBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  gradeText: { color: '#15803D', fontSize: 10, fontWeight: 'bold' }
});

export default AdminDashboard;