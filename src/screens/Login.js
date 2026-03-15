import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    const lowerEmail = email.toLowerCase();
    // Logic: Redirect to AdminRoot if email contains 'admin', else to Main (User Drawer)
    if (lowerEmail.includes('admin')) {
      navigation.replace('AdminRoot');
    } else {
      navigation.replace('Main');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.inner}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Sign In</Text>
          
          <TextInput 
            style={styles.input} 
            placeholder="Email" 
            placeholderTextColor="#9CA3AF" 
            value={email} 
            onChangeText={setEmail} 
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput 
            style={styles.input} 
            placeholder="Password" 
            placeholderTextColor="#9CA3AF" 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry={true} 
          />

          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>New user? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.link}>Create an account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F3F4F6', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  inner: { 
    width: '100%', 
    alignItems: 'center' 
  },
  card: { 
    width: '90%', 
    maxWidth: 400, 
    backgroundColor: '#FFFFFF', 
    borderRadius: 12, 
    paddingVertical: 45,
    paddingHorizontal: 35, 
    elevation: 5, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    alignItems: 'center' 
  },
  title: { 
    fontSize: 28, 
    fontWeight: '700', 
    color: '#111827', 
    marginBottom: 35 
  },
  input: { 
    width: '100%', 
    height: 54, 
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    borderRadius: 8, 
    paddingHorizontal: 16, 
    marginBottom: 20, 
    backgroundColor: '#FAFAFA',
    fontSize: 16,
    color: '#1F2937'
  },
  button: { 
    width: '100%', 
    height: 54, 
    backgroundColor: '#2563EB', 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: 5 
  },
  buttonText: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  footer: { 
    flexDirection: 'row', 
    marginTop: 30 
  },
  footerText: { 
    color: '#6B7280',
    fontSize: 14 
  },
  link: { 
    color: '#2563EB', 
    fontWeight: '600',
    fontSize: 14 
  }
});

export default Login;