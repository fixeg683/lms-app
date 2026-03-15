import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ExamInstances = () => {
  const exams = [
    { id: '1', title: 'Mid-Term Math', status: 'Active', date: 'March 20, 2026' },
    { id: '2', title: 'Final Physics', status: 'Upcoming', date: 'April 12, 2026' },
  ];

  return (
    <FlatList
      data={exams}
      contentContainerStyle={{ padding: 20 }}
      renderItem={({ item }) => (
        <View style={styles.examCard}>
          <View style={[styles.statusBadge, { backgroundColor: item.status === 'Active' ? '#DCFCE7' : '#FEF3C7' }]}>
            <Text style={{ color: item.status === 'Active' ? '#166534' : '#92400E', fontSize: 10, fontWeight: 'bold' }}>{item.status.toUpperCase()}</Text>
          </View>
          <Text style={styles.examTitle}>{item.title}</Text>
          <View style={styles.dateRow}>
            <MaterialCommunityIcons name="calendar" size={14} color="#6B7280" />
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  examCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, marginBottom: 15, elevation: 3 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginBottom: 10 },
  examTitle: { fontSize: 18, fontWeight: '700', marginBottom: 5 },
  dateRow: { flexDirection: 'row', alignItems: 'center' },
  dateText: { marginLeft: 5, fontSize: 13, color: '#6B7280' }
});

export default ExamInstances;