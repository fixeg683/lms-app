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
  ScrollView
} from 'react-native';

const Signup = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('Student'); // Default

  const roles = [
    { label: 'Student', value: 'Student' },
    { label: 'Teacher / Instructor', value: 'Teacher' },
    { label: 'Administrator', value: 'Admin' },
  ];

  const handleSignup = () => {
    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return;
    }
    // Redirect to login to complete the flow
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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

            {/* Custom Role Selector */}
            <Text style={styles.label}>Select Account Type</Text>
            <View style={styles.roleContainer}>
              {roles.map((role) => (
                <TouchableOpacity
                  key={role.value}
                  style={[
                    styles.roleOption,
                    accountType === role.value && styles.selectedRole
                  ]}
                  onPress={() => setAccountType(role.value)}
                >
                  <Text style={[
                    styles.roleText,
                    accountType === role.value && styles.selectedRoleText
                  ]}>
                    {role.label}
                  </Text>
                </TouchableOpacity>
              ))}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  inner: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  card: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 15,
    backgroundColor: '#FFF',
  },
  label: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 10,
    fontWeight: '600',
  },
  roleContainer: {
    width: '100%',
    marginBottom: 20,
  },
  roleOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#FAFAFA',
  },
  selectedRole: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  roleText: {
    color: '#4B5563',
    textAlign: 'center',
    fontSize: 14,
  },
  selectedRoleText: {
    color: '#2563EB',
    fontWeight: '700',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  footer: { 
    flexDirection: 'row', 
    marginTop: 20, 
    justifyContent: 'center' 
  },
  footerText: { color: '#6B7280', fontSize: 14 },
  link: { color: '#2563EB', fontSize: 14, fontWeight: '600' },
});

export default Signup;