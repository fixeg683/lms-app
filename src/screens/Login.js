import React, { useState } from "react"
import { View, Text, TextInput, Button, StyleSheet } from "react-native"
import { signIn } from "../services/authService"

export default function Login({ navigation }) {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {

    const user = await signIn(email, password)

    if (user) {
      navigation.replace("Dashboard")
    } else {
      alert("Login failed")
    }
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Login</Text>

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

      <Button title="Login" onPress={handleLogin} />

      <Text
        style={styles.link}
        onPress={() => navigation.navigate("Signup")}
      >
        Create account
      </Text>

    </View>
  )
}

const styles = StyleSheet.create({
  container:{flex:1,justifyContent:"center",padding:20},
  title:{fontSize:28,marginBottom:20,textAlign:"center"},
  input:{borderWidth:1,padding:10,marginBottom:10,borderRadius:5},
  link:{marginTop:15,textAlign:"center",color:"blue"}
})