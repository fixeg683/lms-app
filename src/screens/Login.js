import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    const lowerEmail = email.toLowerCase();
    if (lowerEmail.includes('admin')) {
      navigation.replace('AdminRoot');
    } else {
      // Redirect to the Sidebar Navigator (MainRoot)
      navigation.replace('Main');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
        <View style={styles.card}>
          <Text style={styles.title}>Sign In</Text>
          <TextInput style={styles.input} placeholder="user@gmail.com" placeholderTextColor="#9CA3AF" value={email} onChangeText={setEmail} autoCapitalize="none" />
          <TextInput style={styles.input} placeholder="••••••" placeholderTextColor="#9CA3AF" value={password} onChangeText={setPassword} secureTextEntry />
          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          <View style={styles.footer}>
            <Text style={styles.footerText}>New user? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}><Text style={styles.link}>Create an account</Text></TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  inner: { width: '100%', alignItems: 'center' },
  card: { width: '90%', maxWidth: 400, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 35, elevation: 5, alignItems: 'center' },
  title: { fontSize: 26, fontWeight: '700', color: '#111827', marginBottom: 30 },
  input: { width: '100%', height: 52, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 16, marginBottom: 16, backgroundColor: '#FAFAFA' },
  button: { width: '100%', height: 52, backgroundColor: '#2563EB', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  footer: { flexDirection: 'row', marginTop: 25 },
  footerText: { color: '#6B7280' },
  link: { color: '#2563EB', fontWeight: '600' }
});

export default Login;