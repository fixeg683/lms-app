import { supabase } from "../lib/supabase"

export const getCourses = async () => {
  const { data, error } = await supabase
    .from("courses")
    .select("*")

  if (error) {
    console.error("Error fetching courses:", error)
    return []
  }

  return data
}

export const getCourseById = async (id) => {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching course:", error)
    return null
  }

  return data
}

export const enrollCourse = async (userId, courseId) => {
  const { data, error } = await supabase
    .from("enrollments")
    .insert([
      {
        user_id: userId,
        course_id: courseId
      }
    ])

  if (error) {
    console.error("Enrollment error:", error)
  }

  return data
}