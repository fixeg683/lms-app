import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const Corrections = () => {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F9FAFB' }} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.header}>Pending Corrections</Text>
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>All submissions have been reviewed!</Text>
        <TouchableOpacity style={styles.refreshBtn}><Text style={styles.btnText}>Check for Updates</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: { fontSize: 24, fontWeight: '800', marginBottom: 20 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#6B7280', fontSize: 16 },
  refreshBtn: { backgroundColor: '#2563EB', padding: 12, borderRadius: 8, marginTop: 20 },
  btnText: { color: '#FFF', fontWeight: 'bold' }
});

export default Corrections;