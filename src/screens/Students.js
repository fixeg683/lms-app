import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Component name updated to 'Students' to match AppNavigator import
const Students = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Student Management</Text>
          <Text style={styles.subtitle}>Manage enrollment and academic records</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.userInfo}>
            <MaterialCommunityIcons name="account-circle" size={40} color="#2563EB" />
            <View style={{ marginLeft: 15 }}>
              <Text style={styles.userName}>John Doe</Text>
              <Text style={styles.userSub}>Grade 10 - Computer Science</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.buttonText}>View Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 20 },
  header: { marginBottom: 25 },
  title: { fontSize: 28, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
    shadowOpacity: 0.1,
  },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  userName: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  userSub: { fontSize: 12, color: '#6B7280' },
  viewButton: { backgroundColor: '#EFF6FF', padding: 8, borderRadius: 6 },
  buttonText: { color: '#2563EB', fontWeight: '600', fontSize: 12 }
});

export default Students;