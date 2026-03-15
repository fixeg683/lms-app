import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator 
} from 'react-native';
import { supabase } from '../lib/supabase';

const Signup = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); 
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password) {
      const msg = "Please fill in both your email and password.";
      Platform.OS === 'web' ? alert(msg) : Alert.alert("Required Fields", msg);
      return;
    }

    setLoading(true);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role: role } 
      }
    });

    setLoading(false);

    if (error) {
      Platform.OS === 'web' ? alert(error.message) : Alert.alert("Signup Error", error.message);
    } else {
      // CROSS-PLATFORM SUCCESS POP-UP
      const successTitle = "Account Created Successfully!";
      const successMsg = "Your account has been registered. Please check your email for a verification link.";

      if (Platform.OS === 'web') {
        // Web fallback using standard browser alert
        alert(`${successTitle}\n\n${successMsg}`);
        navigation.replace('Login');
      } else {
        // Mobile native Alert
        Alert.alert(
          successTitle, 
          successMsg,
          [{ text: "Go to Login", onPress: () => navigation.replace('Login') }],
          { cancelable: false }
        );
      }
    }
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
            placeholder="Email" 
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

          <Text style={styles.label}>Select your role:</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity 
              style={[styles.roleButton, role === 'student' && styles.activeRole]} 
              onPress={() => setRole('student')}
            >
              <Text style={[styles.roleText, role === 'student' && styles.activeRoleText]}>Student</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.roleButton, role === 'admin' && styles.activeRole]} 
              onPress={() => setRole('admin')}
            >
              <Text style={[styles.roleText, role === 'admin' && styles.activeRoleText]}>Admin</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Register Account</Text>
            )}
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

// ... keep existing styles ...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  inner: { width: '100%', alignItems: 'center' },
  card: { width: '90%', maxWidth: 400, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 35, elevation: 5, alignItems: 'center' },
  title: { fontSize: 26, fontWeight: '700', color: '#111827', marginBottom: 25 },
  label: { alignSelf: 'flex-start', color: '#6B7280', marginBottom: 10, fontSize: 14 },
  input: { width: '100%', height: 52, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 16, marginBottom: 16, backgroundColor: '#FAFAFA' },
  roleContainer: { flexDirection: 'row', width: '100%', marginBottom: 25, justifyContent: 'space-between' },
  roleButton: { flex: 0.48, height: 45, borderRadius: 8, borderWidth: 1, borderColor: '#2563EB', justifyContent: 'center', alignItems: 'center' },
  activeRole: { backgroundColor: '#2563EB' },
  roleText: { color: '#2563EB', fontWeight: '600' },
  activeRoleText: { color: '#FFF' },
  button: { width: '100%', height: 52, backgroundColor: '#2563EB', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  footer: { flexDirection: 'row', marginTop: 25 },
  footerText: { color: '#6B7280' },
  link: { color: '#2563EB', fontWeight: '600' }
});

export default Signup;