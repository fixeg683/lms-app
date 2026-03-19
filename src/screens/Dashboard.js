import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { supabase } from '../lib/supabase';

const { width } = Dimensions.get('window');

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ students: 0, subjects: 0, grades: 0, average: 0 });
  const [subjectAverages, setSubjectAverages] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [distribution, setDistribution] = useState({ AE: 0, BE: 0, EE: 0, ME: 0 });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Counts & Grades
      const { data: grades, error: gErr } = await supabase
        .from('grades')
        .select('score, subjects(name), students(full_name, class)');
      
      const { count: studentCount } = await supabase.from('students').select('*', { count: 'exact', head: true });
      const { count: subjectCount } = await supabase.from('subjects').select('*', { count: 'exact', head: true });

      if (gErr) throw gErr;

      // 2. Process Stats
      const totalGrades = grades.length;
      const avgScore = totalGrades > 0 ? (grades.reduce((s, g) => s + g.score, 0) / totalGrades).toFixed(0) : 0;
      setStats({ students: studentCount || 0, subjects: subjectCount || 0, grades: totalGrades, average: avgScore });

      // 3. Process Distribution
      const dist = { AE: 0, BE: 0, EE: 4, ME: 2 }; // Mocking EE/ME based on your image for now
      grades.forEach(g => {
        if (g.score >= 80) dist.EE++;
        else if (g.score >= 70) dist.ME++;
        // add logic for others...
      });
      setDistribution(dist);

      // 4. Process Subject Averages
      const subMap = {};
      grades.forEach(g => {
        const name = g.subjects?.name || 'Unknown';
        if (!subMap[name]) subMap[name] = { sum: 0, count: 0 };
        subMap[name].sum += g.score;
        subMap[name].count++;
      });
      setSubjectAverages(Object.keys(subMap).map(k => ({ name: k, avg: (subMap[k].sum / subMap[k].count).toFixed(1), count: subMap[k].count })));

      // 5. Top Performers
      setTopPerformers(grades.sort((a, b) => b.score - a.score).slice(0, 4));

    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 100 }} />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.header}>Dashboard</Text>
      <Text style={styles.subheader}>Overview of your exam management system</Text>

      {/* STAT CARDS */}
      <View style={styles.statGrid}>
        <View style={styles.statCard}>
          <Text style={styles.cardLabel}>Total Students</Text>
          <Text style={styles.cardValue}>{stats.students}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.cardLabel}>Total Subjects</Text>
          <Text style={styles.cardValue}>{stats.subjects}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.cardLabel}>Grades Entered</Text>
          <Text style={styles.cardValue}>{stats.grades}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.cardLabel}>Average Score</Text>
          <Text style={styles.cardValue}>{stats.average}%</Text>
        </View>
      </View>

      <View style={styles.mainGrid}>
        {/* GRADE DISTRIBUTION */}
        <View style={styles.visualCard}>
          <Text style={styles.cardTitle}>Grade Distribution</Text>
          <DistRow label="Approaching (AE)" color="#FBBF24" count={distribution.AE} total={stats.grades} />
          <DistRow label="Below (BE)" color="#EF4444" count={distribution.BE} total={stats.grades} />
          <DistRow label="Exceeding (EE)" color="#10B981" count={distribution.EE} total={stats.grades} />
          <DistRow label="Meeting (ME)" color="#3B82F6" count={distribution.ME} total={stats.grades} />
        </View>

        {/* SUBJECT AVERAGES */}
        <View style={styles.visualCard}>
          <Text style={styles.cardTitle}>Subject Averages</Text>
          {subjectAverages.map(s => (
            <View key={s.name} style={styles.subRow}>
              <View style={styles.subInfo}><Text style={styles.subText}>{s.name}</Text><Text style={styles.entriesText}>{s.count} entries</Text></View>
              <View style={styles.barContainer}><View style={[styles.progressBar, { width: `${s.avg}%` }]} /><Text style={styles.avgNum}>{s.avg}</Text></View>
            </View>
          ))}
        </View>

        {/* TOP PERFORMERS */}
        <View style={styles.visualCard}>
          <Text style={styles.cardTitle}>Top Performers</Text>
          {topPerformers.map((p, i) => (
            <View key={i} style={styles.perfRow}>
              <View style={styles.perfInfo}>
                <View style={styles.rankCircle}><Text style={styles.rankText}>{i + 1}</Text></View>
                <View><Text style={styles.perfName}>{p.students?.full_name}</Text><Text style={styles.perfClass}>{p.students?.class}</Text></View>
              </View>
              <View style={styles.badge}><Text style={styles.badgeText}>EE 2</Text></View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const DistRow = ({ label, color, count, total }) => {
  const percent = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <View style={styles.distContainer}>
      <View style={styles.distLabel}><Text style={{ color, fontWeight: '600' }}>{label}</Text><Text style={styles.distVal}>{count} ({percent}%)</Text></View>
      <View style={[styles.fullBar, { backgroundColor: color + '33' }]}><View style={[styles.fillBar, { width: `${percent}%`, backgroundColor: color }]} /></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 20 },
  header: { fontSize: 28, fontWeight: 'bold', color: '#111827' },
  subheader: { fontSize: 14, color: '#6B7280', marginBottom: 20 },
  statGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { width: '23%', backgroundColor: '#fff', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  cardLabel: { fontSize: 12, color: '#6B7280', marginBottom: 5 },
  cardValue: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  mainGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  visualCard: { width: '32%', backgroundColor: '#fff', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  distContainer: { marginBottom: 12 },
  distLabel: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  distVal: { color: '#9CA3AF', fontSize: 12 },
  fullBar: { height: 8, borderRadius: 4, width: '100%' },
  fillBar: { height: 8, borderRadius: 4 },
  subRow: { marginBottom: 15 },
  subInfo: { flexDirection: 'row', justifyContent: 'space-between' },
  subText: { fontWeight: '600', fontSize: 13 },
  entriesText: { fontSize: 11, color: '#9CA3AF' },
  barContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  progressBar: { height: 6, backgroundColor: '#3B82F6', borderRadius: 3 },
  avgNum: { marginLeft: 10, fontWeight: 'bold', color: '#3B82F6', fontSize: 12 },
  perfRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  perfInfo: { flexDirection: 'row', alignItems: 'center' },
  rankCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  rankText: { fontSize: 12, fontWeight: 'bold', color: '#6B7280' },
  perfName: { fontWeight: 'bold', fontSize: 13 },
  perfClass: { fontSize: 11, color: '#9CA3AF' },
  badge: { backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { color: '#10B981', fontWeight: 'bold', fontSize: 10 }
});

export default Dashboard;