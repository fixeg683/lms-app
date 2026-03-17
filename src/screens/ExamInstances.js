import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';

const ExamInstances = () => {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const { data, error } = await supabase.from('exam_instances').select('*');
      if (error) throw error;

      setExams(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Exam Instances</Text>

      {exams.map((e) => (
        <View key={e?.id} style={styles.card}>
          <Text style={styles.name}>{e?.name}</Text>
          <Text>ID: {e?.id?.slice(0, 8)}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default ExamInstances;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10
  },

  name: { fontWeight: 'bold' }
});