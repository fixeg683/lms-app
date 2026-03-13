import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert
} from 'react-native';
// Updated import path to match your 'src/lib/supabase.js' structure
import { supabase } from '../lib/supabase';

const Dashboard = ({ navigation }) => {
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('*');
      
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*');

      if (classesError) throw classesError;
      if (coursesError) throw coursesError;

      setClasses(classesData || []);
      setCourses(coursesData || []);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Error', 'Failed to log out');
    } else {
      // Use replace so the user can't go "back" to the dashboard
      navigation.replace('Login');
    }
  };

  const renderTableItem = (item, type) => (
    <View style={styles.card} key={item.id}>
      <Text style={styles.cardTitle}>{item.title || item.name}</Text>
      <View style={styles.cardRow}>
        <Text style={styles.label}>{type === 'class' ? 'Instructor:' : 'Code:'}</Text>
        <Text style={styles.value}>{item.instructor_name || item.course_code || 'N/A'}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.label}>Created:</Text>
        <Text style={styles.value}>{new Date(item.created_at).toLocaleDateString()}</Text>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Logout Button */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.sectionHeader}>🏫 Active Classes ({classes.length})</Text>
        {classes.length > 0 ? (
          classes.map((item) => renderTableItem(item, 'class'))
        ) : (
          <Text style={styles.emptyText}>No classes found in database.</Text>
        )}

        <View style={styles.divider} />

        <Text style={styles.sectionHeader}>📚 Available Courses ({courses.length})</Text>
        {courses.length > 0 ? (
          courses.map((item) => renderTableItem(item, 'course'))
        ) : (
          <Text style={styles.emptyText}>No courses found in database.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  logoutButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#FF3B30', // Red color for logout
  },
  logoutText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  scrollContent: { padding: 16 },
  sectionHeader: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#1C1C1E', 
    marginBottom: 12,
    marginTop: 8 
  },
  card: { 
    backgroundColor: '#FFF', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#007AFF', marginBottom: 8 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  label: { color: '#8E8E93', fontSize: 14 },
  value: { color: '#3A3A3C', fontSize: 14, fontWeight: '500' },
  divider: { height: 24 },
  emptyText: { color: '#8E8E93', textAlign: 'center', marginVertical: 20 }
});

export default Dashboard;