import React, { useEffect, useState } from "react"
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native"
import { getCourses } from "../services/courseService"

export default function CourseList({ navigation }) {

  const [courses, setCourses] = useState([])

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    const data = await getCourses()
    setCourses(data)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Courses</Text>

      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("CourseDetails", { id: item.id })}
          >
            <Text style={styles.courseTitle}>{item.title}</Text>
            <Text>{item.instructor}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  card: { padding: 15, backgroundColor: "#f2f2f2", marginBottom: 10, borderRadius: 8 },
  courseTitle: { fontSize: 18, fontWeight: "bold" }
})