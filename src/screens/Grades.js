import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native';
import { supabase } from '../lib/supabase';

const Grades = () => {
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const { data, error } = await supabase
        .from('grades')
        .select(`
          id, score, status,
          students (full_name),
          subjects (name)
        `);

      if (error) throw error;
      setGrades(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Grades error:', err.message);
      setGrades([]);
    }
  };

  const getRubric = (score = 0) => {
    if (score >= 80) return { label: 'EE 1', color: '#22C55E' };
    if (score >= 70) return { label: 'EE 2', color: '#4ADE80' };
    if (score >= 50) return { label: 'ME 2', color: '#60A5FA' };
    return { label: 'BE', color: '#F87171' };
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Grades</Text>

      {grades.map((g) => {
        const rubric = getRubric(g?.score);

        return (
          <View key={g?.id} style={styles.card}>
            <Text style={styles.name}>
              {g?.students?.full_name || 'Unknown Student'}
            </Text>

            <Text style={styles.subject}>
              {g?.subjects?.name || 'Unknown Subject'}
            </Text>

            <View style={styles.row}>
              <Text>Score: {g?.score ?? 0}</Text>
              <Text style={{ color: rubric.color }}>{rubric.label}</Text>
            </View>

            <Text style={styles.status}>
              🔒 {g?.status || 'unknown'}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default Grades;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F9FAFB' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10
  },

  name: { fontWeight: 'bold', fontSize: 16 },
  subject: { color: '#6B7280', marginBottom: 5 },

  row: { flexDirection: 'row', justifyContent: 'space-between' },

  status: { marginTop: 5, color: '#F59E0B' }
});