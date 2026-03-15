import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Subjects = () => {
  const subjectsData = [
    { id: '1', name: 'Mathematics', code: 'MATH101', teacher: 'Dr. Smith' },
    { id: '2', name: 'Physics', code: 'PHYS202', teacher: 'Prof. Einstein' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.subjectName}>{item.name}</Text>
        <Text style={styles.subjectCode}>{item.code} • {item.teacher}</Text>
      </View>
      <TouchableOpacity style={styles.editBtn}>
        <MaterialCommunityIcons name="pencil-outline" size={20} color="#2563EB" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={subjectsData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listPadding}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.title}>Curriculum</Text>
            <TouchableOpacity style={styles.addBtn}>
              <Text style={styles.addBtnText}>+ New Subject</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  listPadding: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827' },
  addBtn: { backgroundColor: '#2563EB', padding: 10, borderRadius: 8 },
  addBtnText: { color: '#FFF', fontWeight: '600' },
  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  subjectName: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  subjectCode: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  editBtn: { padding: 8, backgroundColor: '#EFF6FF', borderRadius: 8 }
});

export default Subjects;