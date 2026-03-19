import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { supabase } from '../lib/supabase';

// Helper component for Stat Cards
const StatCard = ({ title, value, unit, icon, color }) => (
  <View style={styles.statCard}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={[styles.cardIcon, { backgroundColor: color + '1A' }]}>
        {icon}
      </View>
    </View>
    <View style={styles.valueRow}>
      <Text style={styles.cardValue}>{value}</Text>
      {unit && <Text style={styles.cardUnit}> {unit}</Text>}
    </View>
  </View>
);

// Helper function to format user initials (e.g., "Sammy" -> "SA")
const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.split(' ');
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Helper function to get badge data based on score
const getPerformanceBadge = (score) => {
  if (score >= 90) return { label: 'EE 1', color: '#10B981', bg: '#D1FAE5' };
  if (score >= 80) return { label: 'EE 2', color: '#10B981', bg: '#D1FAE5' };
  if (score >= 70) return { label: 'ME 1', color: '#3B82F6', bg: '#DBEAFE' };
  if (score >= 50) return { label: 'ME 2', color: '#3B82F6', bg: '#DBEAFE' };
  return { label: 'BE 1', color: '#EF4444', bg: '#FEE2E2' };
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [stats, setStats] = useState({
    students: 0,
    subjects: 0,
    grades: 0,
    average: 0,
  });
  const [gradeDistribution, setGradeDistribution] = useState({});
  const [subjectAverages, setSubjectAverages] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // ✅ Parallel fetch for performance and efficiency
      const [studentRes, subjectRes, gradeRes] = await Promise.all([
        supabase.from('students').select('*', { count: 'exact', head: true }),
        supabase.from('subjects').select('name').order('name'),
        supabase.from('grades').select('score, subject_id, subjects(name), students(full_name, class)').order('score', { ascending: false }),
      ]);

      if (studentRes.error) throw studentRes.error;
      if (subjectRes.error) throw subjectRes.error;
      if (gradeRes.error) throw gradeRes.error;

      // --- 1. Top Metric Stats ---
      const numGrades = gradeRes.data.length;
      const totalScore = gradeRes.data.reduce((sum, g) => sum + g.score, 0);
      const avgScore = numGrades > 0 ? (totalScore / numGrades).toFixed(0) : 0;

      setStats({
        students: studentRes.count || 0,
        subjects: subjectRes.data.length || 0,
        grades: numGrades,
        average: avgScore,
      });

      // --- 2. Grade Distribution Calculation ---
      const dist = { AE: 0, BE: 0, EE: 0, ME: 0 };
      gradeRes.data.forEach((g) => {
        if (g.score >= 90) dist.AE++;
        else if (g.score >= 80) dist.EE++;
        else if (g.score >= 70) dist.ME++;
        else if (g.score >= 50) dist.ME++;
        else dist.BE++;
      });
      setGradeDistribution(dist);

      // --- 3. Subject Averages Calculation ---
      const subjectsMap = {};
      gradeRes.data.forEach((grade) => {
        const subjectName = grade.subjects?.name || 'Unknown';
        if (!subjectsMap[subjectName]) {
          subjectsMap[subjectName] = { total: 0, count: 0 };
        }
        subjectsMap[subjectName].total += grade.score;
        subjectsMap[subjectName].count += 1;
      });

      const avgArray = Object.keys(subjectsMap).map((name) => ({
        name,
        average: (subjectsMap[name].total / subjectsMap[name].count).toFixed(1),
        count: subjectsMap[name].count,
      }));
      setSubjectAverages(avgArray);

      // --- 4. Top Performers (Top 5) ---
      const performers = gradeRes.data
        .slice(0, 5)
        .map((grade) => ({
          name: grade.students?.full_name || 'Unnamed',
          className: grade.students?.class || 'No Class',
          score: grade.score,
        }));
      setTopPerformers(performers);

    } catch (error) {
      console.error('Dashboard Fetch Error:', error?.message || error);
      Alert.alert('Error', 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 100 }} />;
  }

  // Helper for performance distribution colors
  const distConfig = {
    AE: { color: '#FBBF24', name: 'Approaching (AE)' },
    BE: { color: '#F87171', name: 'Below (BE)' },
    EE: { color: '#10B981', name: 'Exceeding (EE)' },
    ME: { color: '#3B82F6', name: 'Meeting (ME)' },
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>
      <Text style={styles.subheader}>Overview of your exam management system</Text>

      {/* --- 1. Top Metric Stats (4 Cards) --- */}
      <View style={styles.statGrid}>
        <StatCard title="Total Students" value={stats.students} icon={<Text style={styles.iconText}>👥</Text>} color="#4F46E5" />
        <StatCard title="Total Subjects" value={stats.subjects} icon={<Text style={styles.iconText}>📚</Text>} color="#EC4899" />
        <StatCard title="Grades Entered" value={stats.grades} icon={<Text style={styles.iconText}>✅</Text>} color="#10B981" />
        <StatCard title="Average Score" value={stats.average} unit="%" icon={<Text style={styles.iconText}>🏆</Text>} color="#F59E0B" />
      </View>

      <View style={styles.lowerSection}>
        {/* --- 2. Grade Distribution Chart --- */}
        <View style={styles.mainVisualCard}>
          <Text style={styles.mainCardTitle}>Grade Distribution</Text>
          {Object.keys(gradeDistribution).length === 0 && <Text style={styles.noData}>No data</Text>}
          
          {['AE', 'BE', 'EE', 'ME'].map(key => {
            const count = gradeDistribution[key] || 0;
            const percentage = stats.grades > 0 ? (count / stats.grades * 100).toFixed(0) : 0;
            return (
              <View key={key} style={styles.distRow}>
                <View style={styles.distLabelRow}>
                  <Text style={[styles.distName, { color: distConfig[key].color }]}>{distConfig[key].name}</Text>
                  <Text style={styles.distStats}>{count} ({percentage}%)</Text>
                </View>
                <View style={[styles.distBar, { backgroundColor: distConfig[key].color, width: percentage > 0 ? `${percentage}%` : 5 }]} />
              </View>
            );
          })}
        </View>

        {/* --- 3. Subject Averages Progress Bars --- */}
        <View style={styles.mainVisualCard}>
          <Text style={styles.mainCardTitle}>Subject Averages</Text>
          {subjectAverages.length === 0 && <Text style={styles.noData}>No data available</Text>}
          
          {subjectAverages.map((item) => (
            <View key={item.name} style={styles.subjRow}>
              <View style={styles.subjHeaderRow}>
                <Text style={styles.subjName}>{item.name}</Text>
                <Text style={styles.subjEntries}>{item.count} entries</Text>
              </View>
              <View style={styles.barContainer}>
                <View style={[styles.subjBar, { width: `${item.average}%` }]} />
                <Text style={styles.subjAverage}>{item.average}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* --- 4. Top Performers List --- */}
        <View style={styles.mainVisualCard}>
          <Text style={styles.mainCardTitle}>Top Performers</Text>
          {topPerformers.length === 0 && <Text style={styles.noData}>No grades yet</Text>}

          {topPerformers.map((performer, index) => {
            const badge = getPerformanceBadge(performer.score);
            return (
              <View key={index} style={styles.perfRow}>
                <View style={styles.initialsRow}>
                  <View style={[styles.avatar, { backgroundColor: index === 0 ? '#FBBF24' : '#E5E7EB' }]}>
                    <Text style={[styles.initials, { color: index === 0 ? '#fff' : '#6B7280' }]}>
                      {getInitials(performer.name)}
                    </Text>
                  </View>
                  <View style={styles.nameBlock}>
                    <Text style={styles.perfName}>{performer.name}</Text>
                    <Text style={styles.perfClass}>{performer.className}</Text>
                  </View>
                </View>
                
                <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                  <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

// --- Standardized Visual Styles (from screenshot) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 24, fontFamily: 'Inter_400Regular' },
  header: { fontSize: 32, fontWeight: '700', color: '#111827', marginBottom: 4 },
  subheader: { fontSize: 16, color: '#6B7280', marginBottom: 32 },
  noData: { textAlign: 'center', padding: 20, color: '#9CA3AF' },

  // Stat Card Grid (4 x Cards)
  statGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32, gap: 16 },
  statCard: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 24, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#E5E7EB',
    shadowColor: '#111', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  cardIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  iconText: { fontSize: 22 },
  valueRow: { flexDirection: 'row', alignItems: 'flex-end' },
  cardValue: { fontSize: 36, fontWeight: '700', color: '#111827' },
  cardUnit: { fontSize: 24, color: '#9CA3AF', marginBottom: 4 },

  // Lower Section (3 x Visuals)
  lowerSection: { flexDirection: 'row', gap: 24 },
  mainVisualCard: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 24, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#E5E7EB',
    shadowColor: '#111', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  mainCardTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 20 },

  // Grade Distribution Bar Chart
  distRow: { marginBottom: 16 },
  distLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  distName: { fontSize: 14, fontWeight: '600' },
  distStats: { fontSize: 14, color: '#6B7280' },
  distBar: { height: 10, borderRadius: 5 },

  // Subject Average Progress Bars
  subjRow: { marginBottom: 12 },
  subjHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  subjName: { fontSize: 14, color: '#111827', fontWeight: '600' },
  subjEntries: { fontSize: 12, color: '#9CA3AF' },
  barContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  subjBar: { flex: 1, height: 10, backgroundColor: '#3B82F6', borderRadius: 5 }, // Blue
  subjAverage: { fontSize: 16, fontWeight: '700', color: '#111827', minWidth: 40 },

  // Top Performers List
  perfRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  initialsRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  initials: { fontSize: 18, fontWeight: '700' },
  nameBlock: { },
  perfName: { fontSize: 16, color: '#111827', fontWeight: '600' },
  perfClass: { fontSize: 13, color: '#9CA3AF', marginTop: 1 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  badgeText: { fontSize: 13, fontWeight: '700' }
});

export default Dashboard;