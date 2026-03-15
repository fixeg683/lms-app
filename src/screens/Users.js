import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Users = () => {
  const users = [
    { id: '1', name: 'Admin One', role: 'Administrator', email: 'admin@lms.com' },
    { id: '2', name: 'Teacher Smith', role: 'Instructor', email: 'smith@lms.com' },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        contentContainerStyle={{ padding: 20 }}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <MaterialCommunityIcons name="account-circle-outline" size={40} color="#9CA3AF" />
            <View style={styles.textContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.role}>{item.role} • {item.email}</Text>
            </View>
            <MaterialCommunityIcons name="dots-vertical" size={24} color="#6B7280" />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  userCard: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  textContainer: { flex: 1, marginLeft: 15 },
  name: { fontSize: 16, fontWeight: '700' },
  role: { fontSize: 12, color: '#6B7280' }
});

export default Users;