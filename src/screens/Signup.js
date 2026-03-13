import React, { useState } from "react"
import { View, Text, TextInput, Button, StyleSheet } from "react-native"
import { signUp } from "../services/authService"

export default function Signup({ navigation }) {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignup = async () => {

    const user = await signUp(email, password)

    if (user) {
      alert("Account created!")
      navigation.navigate("Login")
    } else {
      alert("Signup failed")
    }
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        onChangeText={setPassword}
      />

      <Button title="Sign Up" onPress={handleSignup} />

    </View>
  )
}

const styles = StyleSheet.create({
  container:{flex:1,justifyContent:"center",padding:20},
  title:{fontSize:28,marginBottom:20,textAlign:"center"},
  input:{borderWidth:1,padding:10,marginBottom:10,borderRadius:5}
})