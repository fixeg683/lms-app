import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const Signup = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('Teacher');

  const handleSignup = () => {
    // Logic: In a real app, you'd save the accountType to the DB here
    Alert.alert(
      "Account Created", 
      "Your account has been created successfully. Please sign in.",
      [{ text: "OK", onPress: () => navigation.navigate('Login') }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Create Account</Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Account Type</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={accountType}
                onValueChange={(itemValue) => setAccountType(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Teacher / Instructor" value="Teacher" />
                <Picker.Item label="Administrator" value="Admin" />
                <Picker.Item label="Student" value="Student" />
              </Picker>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  inner: { width: '100%', alignItems: 'center' },
  card: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 35,
    paddingHorizontal: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  title: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 30, textAlign: 'center' },
  input: { width: '100%', height: 48, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 6, paddingHorizontal: 16, marginBottom: 16, backgroundColor: '#FFF', fontSize: 14 },
  pickerContainer: { width: '100%', marginBottom: 20 },
  label: { fontSize: 12, color: '#6B7280', marginBottom: 8, fontWeight: '500' },
  pickerWrapper: { borderWidth: 1, borderColor: '#2563EB', borderRadius: 6, overflow: 'hidden', backgroundColor: '#F9FAFB' },
  picker: { height: 45, width: '100%', backgroundColor: 'transparent' },
  button: { width: '100%', height: 48, backgroundColor: '#2563EB', borderRadius: 6, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  footer: { flexDirection: 'row', marginTop: 25, justifyContent: 'center' },
  footerText: { color: '#6B7280', fontSize: 13 },
  link: { color: '#2563EB', fontSize: 13, fontWeight: '600' },
});

export default Signup;