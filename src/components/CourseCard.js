import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"

export default function CourseCard({ course, onPress }) {

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>

      <Text style={styles.title}>
        {course.title}
      </Text>

      <Text style={styles.instructor}>
        Instructor: {course.instructor}
      </Text>

    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8
  },

  title: {
    fontSize: 18,
    fontWeight: "bold"
  },

  instructor: {
    marginTop: 5,
    color: "#666"
  }

})