import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

const Corrections = () => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    console.log('Searching:', query);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grade Corrections</Text>

      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Grade Corrections</Text>
        <Text style={styles.bannerText}>
          Search for a student, unlock grades, edit, and save.
        </Text>
      </View>

      <View style={styles.searchRow}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search student..."
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Corrections;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F9FAFB' },

  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },

  banner: {
    backgroundColor: '#FEF3C7',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20
  },

  bannerTitle: { fontWeight: 'bold', marginBottom: 5 },
  bannerText: { color: '#92400E' },

  searchRow: {
    flexDirection: 'row',
    gap: 10
  },

  input: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8
  },

  button: {
    backgroundColor: '#4F46E5',
    padding: 12,
    borderRadius: 8
  },

  buttonText: { color: '#fff' }
});