import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('student');
  const tabs = ['student', 'class', 'subject'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reports</Text>
      <Text style={styles.subtitle}>
        Generate and view performance reports
      </Text>

      {/* Tabs - Styled to match your UI screenshots */}
      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab ? styles.activeText : styles.inactiveText
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Report
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Placeholder Content */}
      <View style={styles.card}>
        <View style={styles.emptyState}>
            <Text style={styles.iconPlaceholder}>📊</Text>
            <Text style={styles.cardText}>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} report generator coming soon...
            </Text>
        </View>
      </View>
    </View>
  );
};

export default Reports;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F9FAFB' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  subtitle: { color: '#6B7280', marginBottom: 24, fontSize: 14 },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6'
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#E0E7FF'
  },
  tabText: { fontSize: 12, fontWeight: 'bold' },
  activeText: { color: '#4F46E5' },
  inactiveText: { color: '#9CA3AF' },
  card: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyState: { alignItems: 'center' },
  iconPlaceholder: { fontSize: 40, marginBottom: 12 },
  cardText: { color: '#6B7280', textAlign: 'center', fontWeight: '500' } // Fixed the 'd' typo here
});