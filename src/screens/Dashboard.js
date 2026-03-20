import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import { supabase } from '../lib/supabase';

const { width } = Dimensions.get('window');

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ students: 0, subjects: 0, grades: 0, average: 0 });
  const [subjectAverages, setSubjectAverages] = useState([]);
  const [classPerformance, setClassPerformance] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [distribution, setDistribution] = useState({ AE: 0, BE: 0, EE: 0, ME: 0 });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // ✅ Step 0: Verify Session (Ensures Admin/Teacher role doesn't block local state)
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError || !session) {
        console.error("Auth session missing");
        return;
      }

      // 1. Fetch Counts & Grades with joins
      // Note: We fetch everything. RLS on Supabase will handle restricting 
      // specific rows if you've set up teacher-specific policies.
      const [gradesRes, studentRes, subjectRes] = await Promise.all([
        supabase.from('grades').select('score, subjects(name), students(full_name, class)'),
        supabase.from('students').select('*', { count: 'exact', head: true }),
        supabase.from('subjects').select('*', { count: 'exact', head: true })
      ]);

      if (gradesRes.error) throw gradesRes.error;

      const grades = gradesRes.data || [];
      const studentCount = studentRes.count || 0;
      const subjectCount = subjectRes.count || 0;

      // 2. Process General Stats
      const totalGrades = grades.length;
      const avgScore = totalGrades > 0 
        ? (grades.reduce((s, g) => s + (g.score || 0), 0) / totalGrades).toFixed(0) 
        : 0;

      setStats({ 
        students: studentCount, 
        subjects: subjectCount, 
        grades: totalGrades, 
        average: avgScore 
      });

      // 3. Process Logic for Distribution, Class Performance, and Subjects
      const dist = { AE: 0, BE: 0, EE: 0, ME: 0 };
      const subMap = {};
      const classMap = {};

      grades.forEach(g => {
        const score = g.score || 0;
        const subName = g.subjects?.name || 'Unknown';
        const className = g.students?.class || 'Unassigned';
        const studentName = g.students?.full_name || 'Anonymous';

        // Distribution logic
        if (score >= 90) dist.AE++;
        else if (score >= 80) dist.EE++;
        else if (score >= 50) dist.ME++;
        else dist.BE++;

        // Subject Averages logic
        if (!subMap[subName]) subMap[subName] = { sum: 0, count: 0 };
        subMap[subName].sum += score;
        subMap[subName].count++;

        // Class Performance logic
        if (!classMap[className]) {
          classMap[className] = { sum: 0, count: 0, top: { name: '', score: 0 } };
        }
        classMap[className].sum += score;
        classMap[className].count++;
        if (score > classMap[className].top.score) {
          classMap[className].top = { name: studentName, score: score };
        }
      });

      // 4. Update States
      setDistribution(dist);
      
      setSubjectAverages(Object.keys(subMap).map(k => ({
        name: k,
        avg: (subMap[k].sum / subMap[k].count).toFixed(1),
        count: subMap[k].count
      })));

      setClassPerformance(Object.keys(classMap).map(k => ({
        className: k,
        avg: (classMap[k].sum / classMap[k].count).toFixed(1),
        topStudent: classMap[k].top.name
      })));

      setTopPerformers(grades.sort((a, b) => b.score - a.score).slice(0, 4));

    } catch (error) {
      console.error("Dashboard error:", error.message);
      Alert.alert("Data Error", "Could not load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <View style={[styles.container, { justifyContent: 'center' }]}>
      <ActivityIndicator size="large" color="#4F46E5" />
      <Text style={{ textAlign: 'center', marginTop: 10, color: '#6B7280' }}>Loading Analytics...</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.header}>Dashboard</Text>
      <Text style={styles.subheader}>System Overview • All Roles</Text>

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

        {/* CLASS PERFORMANCE */}
        <View style={styles.visualCard}>
          <Text style={styles.cardTitle}>Class Performance</Text>
          {classPerformance.length === 0 ? <Text style={styles.emptyText}>No class data</Text> : 
            classPerformance.map(c => (
              <View key={c.className} style={styles.itemRow}>
                 <View style={styles.subInfo}>
                    <Text style={styles.subText}>{c.className}</Text>
                    <Text style={styles.avgNum}>{c.avg}%</Text>
                 </View>
                 <View style={styles.barContainer}>
                    <View style={[styles.progressBar, { width: `${c.avg}%`, backgroundColor: '#4F46E5' }]} />
                 </View>
                 <Text style={styles.topLabel}>🏆 Top: {c.topStudent}</Text>
              </View>
            ))
          }
        </View>

        {/* SUBJECT AVERAGES */}
        <View style={styles.visualCard}>
          <Text style={styles.cardTitle}>Subject Averages</Text>
          {subjectAverages.length === 0 ? <Text style={styles.emptyText}>No subject data</Text> :
            subjectAverages.map(s => (
              <View key={s.name} style={styles.subRow}>
                <View style={styles.subInfo}>
                  <Text style={styles.subText}>{s.name}</Text>
                  <Text style={styles.entriesText}>{s.count} entries</Text>
                </View>
                <View style={styles.barContainer}>
                  <View style={[styles.progressBar, { width: `${s.avg}%` }]} />
                  <Text style={styles.avgNum}>{s.avg}</Text>
                </View>
              </View>
            ))
          }
        </View>
      </View>
    </ScrollView>
  );
};

const DistRow = ({ label, color, count, total }) => {
  const percent = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <View style={styles.distContainer}>
      <View style={styles.distLabel}>
        <Text style={{ color, fontWeight: '600' }}>{label}</Text>
        <Text style={styles.distVal}>{count} ({percent}%)</Text>
      </View>
      <View style={[styles.fullBar, { backgroundColor: color + '33' }]}>
        <View style={[styles.fillBar, { width: `${percent}%`, backgroundColor: color }]} />
      </View>
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
  mainGrid: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' },
  visualCard: { width: '32%', backgroundColor: '#fff', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  distContainer: { marginBottom: 12 },
  distLabel: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  distVal: { color: '#9CA3AF', fontSize: 12 },
  fullBar: { height: 8, borderRadius: 4, width: '100%', backgroundColor: '#F3F4F6' },
  fillBar: { height: 8, borderRadius: 4 },
  subRow: { marginBottom: 15 },
  itemRow: { marginBottom: 20 },
  subInfo: { flexDirection: 'row', justifyContent: 'space-between' },
  subText: { fontWeight: '600', fontSize: 13 },
  entriesText: { fontSize: 11, color: '#9CA3AF' },
  topLabel: { fontSize: 11, color: '#6B7280', marginTop: 4, fontStyle: 'italic' },
  barContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  progressBar: { height: 6, backgroundColor: '#3B82F6', borderRadius: 3 },
  avgNum: { marginLeft: 10, fontWeight: 'bold', color: '#3B82F6', fontSize: 12 },
  emptyText: { textAlign: 'center', color: '#9CA3AF', fontSize: 12, marginTop: 10 },
});

export default Dashboard;