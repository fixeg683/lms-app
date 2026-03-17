import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';

const AdminDashboard = () => {
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

      // Average
      const avg =
        safeGrades.length > 0
          ? (
              safeGrades.reduce((sum, g) => sum + (g.score || 0), 0) /
              safeGrades.length
            ).toFixed(1)
          : 0;

      // Distribution
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
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>
      <Text style={styles.subHeader}>
        Overview of your exam management system
      </Text>

      {/* Summary Cards */}
      <View style={styles.grid}>
        <Card title="Total Students" value={stats.students} icon="👥" color="#2563EB" />
        <Card title="Total Subjects" value={stats.subjects} icon="📚" color="#7C3AED" />
        <Card title="Grades Entered" value={stats.grades} icon="✅" color="#059669" />
        <Card title="Average Score" value={`${stats.average}%`} icon="🏆" color="#D97706" />
      </View>

      <View style={styles.contentLayout}>
        {/* Grade Distribution */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Grade Distribution</Text>

          <DistItem
            label="Exceeding (EE)"
            count={distribution.EE}
            percent={Math.round((distribution.EE / total) * 100)}
            color="#22C55E"
          />

          <DistItem
            label="Meeting (ME)"
            count={distribution.ME}
            percent={Math.round((distribution.ME / total) * 100)}
            color="#3B82F6"
          />

          <DistItem
            label="Below (BE)"
            count={distribution.BE}
            percent={Math.round((distribution.BE / total) * 100)}
            color="#F87171"
          />
        </View>

        {/* Top Performers (static for now, safe fallback) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Top Performers</Text>

          <Performer rank="1" name="Top Student" grade="EE" color="#FACC15" />
          <Performer rank="2" name="Second Student" grade="EE" color="#D1D5DB" />
          <Performer rank="3" name="Third Student" grade="ME" color="#FDBA74" />
        </View>
      </View>
    </ScrollView>
  );
};

// Components
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
    <View style={styles.distRow}>
      <Text style={styles.smallLabel}>{label}</Text>
      <Text style={styles.smallLabel}>
        {count} ({percent}%)
      </Text>
    </View>

    <View style={styles.progressBarBg}>
      <View
        style={[
          styles.progressBarFill,
          { width: `${percent}%`, backgroundColor: color }
        ]}
      />
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

    <View style={styles.gradeBadge}>
      <Text style={styles.gradeText}>{grade}</Text>
    </View>
  </View>
);

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 20 },

  header: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  subHeader: { fontSize: 14, color: '#6B7280', marginBottom: 20 },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },

  statCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    width: '48%',
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  statLabel: { fontSize: 10, fontWeight: 'bold', color: '#9CA3AF' },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#111827' },

  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20
  },

  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },

  smallLabel: { fontSize: 10, fontWeight: 'bold', color: '#9CA3AF' },

  distRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },

  progressBarBg: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden'
  },

  progressBarFill: { height: '100%' },

  performerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },

  performerLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  rankCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center'
  },

  rankText: { color: 'white', fontSize: 12, fontWeight: 'bold' },

  nameText: { fontSize: 14, fontWeight: 'bold' },
  classText: { fontSize: 10, color: '#9CA3AF' },

  gradeBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },

  gradeText: { color: '#15803D', fontSize: 10, fontWeight: 'bold' },

  icon: { fontSize: 20 }
});

export default AdminDashboard;