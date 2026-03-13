import { supabase } from "../lib/supabase"

export const signUp = async (email, password) => {

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) {
    console.error("Signup error:", error.message)
    return null
  }

  return data
}

export const signIn = async (email, password) => {

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    console.error("Login error:", error.message)
    return null
  }

  return data
}

export const signOut = async () => {

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Logout error:", error.message)
  }
}

export const getCurrentUser = async () => {

  const { data } = await supabase.auth.getUser()

  return data?.user
}