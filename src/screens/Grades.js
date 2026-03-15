import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const Grades = () => {
  const grades = [
    { student: 'Alice Johnson', subject: 'Math', grade: 'A', score: '92%' },
    { student: 'Bob Williams', subject: 'Physics', grade: 'B+', score: '88%' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>Grade Center</Text>
      {grades.map((item, index) => (
        <View key={index} style={styles.gradeRow}>
          <View>
            <Text style={styles.studentName}>{item.student}</Text>
            <Text style={styles.detailText}>{item.subject}</Text>
          </View>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>{item.score}</Text>
            <Text style={styles.gradeLetter}>{item.grade}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 20 },
  gradeRow: { backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  studentName: { fontSize: 16, fontWeight: '600' },
  detailText: { fontSize: 13, color: '#6B7280' },
  scoreContainer: { alignItems: 'flex-end' },
  scoreText: { fontSize: 16, fontWeight: '700', color: '#2563EB' },
  gradeLetter: { fontSize: 12, color: '#10B981', fontWeight: 'bold' }
});

export default Grades;