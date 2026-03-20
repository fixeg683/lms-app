import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';

// ✅ CORRECT IMPORTS (No curly braces for default exports)
import AddClassModal from '../components/AddClassModal';
import EditClassModal from '../components/EditClassModal';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editConfig, setEditConfig] = useState({ open: false, data: null });

  useEffect(() => { fetchClasses(); }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('classes').select('*').order('name');
      if (error) throw error;
      setClasses(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Classes</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setIsAddModalOpen(true)}>
          <Text style={styles.addText}>+ Add Class</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView style={styles.table}>
          {classes.map((item) => (
            <View key={item.id} style={styles.row}>
              <Text style={styles.cell}>{item.name}</Text>
              <TouchableOpacity onPress={() => setEditConfig({ open: true, data: item })}>
                <Text style={styles.editIcon}>✎</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* ✅ Modals rendered with proper checks */}
      {AddClassModal && (
        <AddClassModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onRefresh={fetchClasses} 
        />
      )}

      {EditClassModal && (
        <EditClassModal 
          isOpen={editConfig.open} 
          classData={editConfig.data} 
          onClose={() => setEditConfig({ open: false, data: null })} 
          onRefresh={fetchClasses} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  addButton: { backgroundColor: '#4F46E5', padding: 10, borderRadius: 8 },
  addText: { color: '#fff', fontWeight: 'bold' },
  table: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#eee' },
  row: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderColor: '#eee', justifyContent: 'space-between' },
  cell: { fontSize: 16, color: '#374151' },
  editIcon: { fontSize: 20, color: '#9CA3AF' }
});

export default Classes;