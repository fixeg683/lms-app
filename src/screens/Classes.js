import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { supabase } from '../lib/supabase';
import AddClassModal from '../components/AddClassModal';
import EditClassModal from '../components/EditClassModal'; // ✅ Add this

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // ✅ State to manage Edit Modal
  const [editConfig, setEditConfig] = useState({ open: false, classData: null });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const { data } = await supabase.from('classes').select('*').order('name');
    setClasses(data || []);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Classes</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setIsAddModalOpen(true)}>
          <Text style={styles.addText}>+ Add Class</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.table}>
        {classes.map((item) => (
          <View key={item.id} style={styles.row}>
            <Text style={styles.cell}>{item.name}</Text>
            
            {/* ✅ Update Edit Button */}
            <TouchableOpacity onPress={() => setEditConfig({ open: true, classData: item })}>
              <Text style={styles.editIcon}>✎</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <AddClassModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onRefresh={fetchClasses} />
      
      {/* ✅ Add Edit Modal Component */}
      <EditClassModal 
        isOpen={editConfig.open} 
        classData={editConfig.classData} 
        onClose={() => setEditConfig({ open: false, classData: null })} 
        onRefresh={fetchClasses} 
      />
    </View>
  );
};
// ... styles (ensure editIcon color is defined)