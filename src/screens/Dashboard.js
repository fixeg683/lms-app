import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native';
import { supabase } from '../lib/supabase';

const Dashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    subjects: 0,
    grades: 0,
    average: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: students } = await supabase.from('students').select('id');
      const { data: subjects } = await supabase.from('subjects').select('id');
      const { data: grades } = await supabase.from('grades').select('score');

      const avg =
        grades?.length > 0
          ? (
              grades.reduce((sum, g) => sum + (g.score || 0), 0) /
              grades.length
            ).toFixed(1)
          : 0;

      setStats({
        students: students?.length || 0,
        subjects: subjects?.length || 0,
        grades: grades?.length || 0,
        average: avg
      });
    } catch (err) {
      console.error('Dashboard error:', err.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.grid}>
        <Stat label="Students" value={stats.students} />
        <Stat label="Subjects" value={stats.subjects} />
        <Stat label="Grades" value={stats.grades} />
        <Stat label="Average" value={`${stats.average}%`} />
      </View>
    </ScrollView>
  );
};

const Stat = ({ label, value }) => (
  <View style={styles.card}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default Dashboard;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F9FAFB' },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },

  card: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10
  },

  label: { color: '#6B7280' },
  value: { fontSize: 20, fontWeight: 'bold' }
});