import React, { useEffect, useState } from "react"
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from "react-native"

import { getCourseById, enrollCourse } from "../services/courseService"
import { supabase } from "../lib/supabase"

export default function CourseDetails({ route }) {

  const { id } = route.params

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    loadCourse()
  }, [])

  const loadCourse = async () => {

    const data = await getCourseById(id)

    if (data) {
      setCourse(data)
    }

    setLoading(false)
  }

  const enroll = async () => {

    setEnrolling(true)

    try {

      const { data } = await supabase.auth.getUser()

      const user = data?.user

      if (!user) {
        Alert.alert("Authentication Required", "Please login to enroll.")
        return
      }

      await enrollCourse(user.id, id)

      Alert.alert("Success", "You have successfully enrolled!")

    } catch (error) {

      console.error("Enrollment error:", error)
      Alert.alert("Error", "Enrollment failed.")

    } finally {

      setEnrolling(false)

    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (!course) {
    return (
      <View style={styles.center}>
        <Text>Course not found</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>{course.title}</Text>

      <Text style={styles.instructor}>
        Instructor: {course.instructor}
      </Text>

      <Text style={styles.description}>
        {course.description}
      </Text>

      <Button
        title={enrolling ? "Enrolling..." : "Enroll in Course"}
        onPress={enroll}
        disabled={enrolling}
      />

    </View>
  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10
  },

  instructor: {
    fontSize: 16,
    marginBottom: 20
  },

  description: {
    fontSize: 16,
    marginBottom: 30
  }

})