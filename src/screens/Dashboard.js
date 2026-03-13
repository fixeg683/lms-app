import React from "react"
import { View, Text, Button, StyleSheet } from "react-native"
import { signOut } from "../services/authService"

export default function Dashboard({ navigation }) {

  const logout = async () => {
    await signOut()
    navigation.replace("Login")
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>LMS Dashboard</Text>

      <Button
        title="View Courses"
        onPress={() => navigation.navigate("CourseList")}
      />

      <Button
        title="Logout"
        onPress={logout}
      />

    </View>
  )
}

const styles = StyleSheet.create({
  container:{flex:1,justifyContent:"center",alignItems:"center"},
  title:{fontSize:26,marginBottom:20}
})