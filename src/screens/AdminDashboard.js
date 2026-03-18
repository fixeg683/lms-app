import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { supabase } from '../lib/supabase';

const AdminDashboard = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [stats, setStats] = useState({
    students: 0,
    subjects: 0,
    grades: 0,
    average: 0
  });

  const [distribution, setDistribution] = useState({
    EE: 0,
    ME: 0,
    BE: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: students } = await supabase.from('students').select('id');
      const { data: subjects } = await supabase.from('subjects').select('id');
      const { data: grades } = await supabase.from('grades').select('score');

      const safeGrades = Array.isArray(grades) ? grades : [];

      const avg =
        safeGrades.length > 0
          ? (
              safeGrades.reduce((sum, g) => sum + (g.score || 0), 0) /
              safeGrades.length
            ).toFixed(1)
          : 0;

      let EE = 0, ME = 0, BE = 0;
      safeGrades.forEach((g) => {
        const score = g?.score || 0;
        if (score >= 70) EE++;
        else if (score >= 50) ME++;
        else BE++;
      });

      setStats({
        students: students?.length || 0,
        subjects: subjects?.length || 0,
        grades: safeGrades.length,
        average: avg
      });

      setDistribution({ EE, ME, BE });
    } catch (err) {
      console.error('Dashboard error:', err.message);
    }
  };

  const total = distribution.EE + distribution.ME + distribution.BE || 1;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.header}>Dashboard</Text>
      <Text style={styles.subHeader}>
        Overview of your exam management system
      </Text>

      {/* Summary Cards - Grid stacks 1-column on mobile, 2-column on tablet */}
      <View style={styles.grid}>
        <Card title="Total Students" value={stats.students} icon="👥" color="#2563EB" isMobile={isMobile} />
        <Card title="Total Subjects" value={stats.subjects} icon="📚" color="#7C3AED" isMobile={isMobile} />
        <Card title="Grades Entered" value={stats.grades} icon="✅" color="#059669" isMobile={isMobile} />
        <Card title="Average Score" value={`${stats.average}%`} icon="🏆" color="#D97706" isMobile={isMobile} />
      </View>

      <View style={[styles.contentLayout, { flexDirection: isMobile ? 'column' : 'row' }]}>
        {/* Grade Distribution */}
        <View style={[styles.card, !isMobile && { flex: 1, marginRight: 10 }]}>
          <Text style={styles.cardTitle}>Grade Distribution</Text>
          <DistItem label="Exceeding (EE)" count={distribution.EE} percent={Math.round((distribution.EE / total) * 100)} color="#22C55E" />
          <DistItem label="Meeting (ME)" count={distribution.ME} percent={Math.round((distribution.ME / total) * 100)} color="#3B82F6" />
          <DistItem label="Below (BE)" count={distribution.BE} percent={Math.round((distribution.BE / total) * 100)} color="#F87171" />
        </View>

        {/* Top Performers */}
        <View style={[styles.card, !isMobile && { flex: 1, marginLeft: 10 }]}>
          <Text style={styles.cardTitle}>Top Performers</Text>
          <Performer rank="1" name="Top Student" grade="EE" color="#FACC15" />
          <Performer rank="2" name="Second Student" grade="EE" color="#D1D5DB" />
          <Performer rank="3" name="Third Student" grade="ME" color="#FDBA74" />
        </View>
      </View>
    </ScrollView>
  );
};

// Sub-components
const Card = ({ title, value, icon, color, isMobile }) => (
  <View style={[styles.statCard, { width: isMobile ? '100%' : '48%' }]}>
    <View style={{ flex: 1 }}>
      <Text style={styles.statLabel} numberOfLines={1}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
    <Text style={[styles.icon, { color }]}>{icon}</Text>
  </View>
);

const DistItem = ({ label, count, percent, color }) => (
  <View style={{ marginBottom: 15 }}>
    <View style={styles.distRow}>
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
    <View style={styles.performerLeft}>
      <View style={[styles.rankCircle, { backgroundColor: color }]}>
        <Text style={styles.rankText}>{rank}</Text>
      </View>
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.nameText}>{name}</Text>
        <Text style={styles.classText}>Class</Text>
      </View>
    </View>
    <View style={styles.gradeBadge}><Text style={styles.gradeText}>{grade}</Text></View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginTop: 10 },
  subHeader: { fontSize: 14, color: '#6B7280', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // Shadow for better UI
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statLabel: { fontSize: 12, fontWeight: 'bold', color: '#9CA3AF', textTransform: 'uppercase' },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#111827', marginTop: 4 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 16, marginBottom: 16, elevation: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#1F2937' },
  smallLabel: { fontSize: 11, fontWeight: 'bold', color: '#6B7280' },
  distRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressBarBg: { height: 10, backgroundColor: '#F3F4F6', borderRadius: 5, overflow: 'hidden' },
  progressBarFill: { height: '100%' },
  performerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  performerLeft: { flexDirection: 'row', alignItems: 'center' },
  rankCircle: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  rankText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  nameText: { fontSize: 14, fontWeight: 'bold', color: '#1F2937' },
  classText: { fontSize: 11, color: '#9CA3AF' },
  gradeBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  gradeText: { color: '#15803D', fontSize: 10, fontWeight: 'bold' },
  icon: { fontSize: 24 }
});

export default AdminDashboard;