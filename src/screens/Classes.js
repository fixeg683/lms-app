import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  SafeAreaView, Modal, TextInput, Alert, ActivityIndicator 
} from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { supabase } from '../lib/supabase'; // Adjust path if necessary

const Classes = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);

  // Form State
  const [subject, setSubject] = useState('');
  const [room, setRoom] = useState('');
  const [teacher, setTeacher] = useState('');
  const [time, setTime] = useState('');

  // 1. Fetch classes from Supabase on load
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.log('Error fetching:', error);
    else setClasses(data || []);
  };

  // 2. Handle Save to Supabase
  const handleAddClass = async () => {
    if (!subject || !room || !time) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('classes')
      .insert([{ 
        subject_name: subject, 
        room_number: room, 
        instructor_name: teacher, 
        class_time: time 
      }]);

    setLoading(false);
    if (error) {
      Alert.alert("Upload Failed", error.message);
    } else {
      setModalVisible(false);
      clearForm();
      fetchClasses(); // Refresh list
    }
  };

  const clearForm = () => {
    setSubject('');
    setRoom('');
    setTeacher('');
    setTime('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Class Schedule</Text>
          <TouchableOpacity 
            style={styles.addBtn} 
            onPress={() => setModalVisible(true)}
          >
            <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {classes.map((item) => (
          <View key={item.id} style={styles.classCard}>
            <View style={[styles.indicator, { backgroundColor: '#2563EB' }]} />
            <View style={styles.cardMain}>
              <Text style={styles.timeText}>{item.class_time}</Text>
              <Text style={styles.subjectText}>{item.subject_name}</Text>
              <View style={styles.footerRow}>
                <Text style={styles.infoText}>📍 {item.room_number}</Text>
                <Text style={styles.infoText}>👤 {item.instructor_name}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* --- ADD CLASS MODAL --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Add New Class</Text>

            <TextInput
              style={styles.input}
              placeholder="Subject Name (e.g. Math 101)"
              value={subject}
              onChangeText={setSubject}
            />
            <TextInput
              style={styles.input}
              placeholder="Time (e.g. 08:00 AM - 10:00 AM)"
              value={time}
              onChangeText={setTime}
            />
            <TextInput
              style={styles.input}
              placeholder="Room Number"
              value={room}
              onChangeText={setRoom}
            />
            <TextInput
              style={styles.input}
              placeholder="Instructor Name"
              value={teacher}
              onChangeText={setTeacher}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.btn, styles.cancelBtn]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.btn, styles.saveBtn]} 
                onPress={handleAddClass}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveBtnText}>Save Class</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContent: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#111827' },
  addBtn: { backgroundColor: '#2563EB', width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  classCard: { backgroundColor: '#FFF', borderRadius: 12, marginBottom: 12, flexDirection: 'row', overflow: 'hidden', elevation: 2 },
  indicator: { width: 6 },
  cardMain: { padding: 15, flex: 1 },
  timeText: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
  subjectText: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  footerRow: { flexDirection: 'row', marginTop: 10 },
  infoText: { marginRight: 15, fontSize: 13, color: '#4B5563' },
  
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalView: { width: '90%', maxWidth: 400, backgroundColor: 'white', borderRadius: 20, padding: 25, shadowOpacity: 0.25, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  input: { width: '100%', height: 50, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 15, marginBottom: 15, backgroundColor: '#FAFAFA' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  btn: { flex: 1, height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 },
  cancelBtn: { backgroundColor: '#F3F4F6' },
  saveBtn: { backgroundColor: '#2563EB' },
  cancelBtnText: { color: '#4B5563', fontWeight: '600' },
  saveBtnText: { color: '#FFF', fontWeight: '600' }
});

export default Classes;