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
  const [accountType, setAccountType] = useState('Teacher'); // Default state

  const handleSignup = () => {
    // 1. Basic Validation
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // 2. Logic to handle the specific Admin flow
    console.log(`Creating ${accountType} account for:`, email);

    // 3. Success Feedback & Redirect
    Alert.alert(
      "Success", 
      `Account created as ${accountType}. Please sign in to access your dashboard.`,
      [{ 
        text: "Go to Login", 
        onPress: () => navigation.navigate('Login', { role: accountType }) 
      }]
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

          {/* This button is now linked to handleSignup */}
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

// ... Styles remain the same as previous version