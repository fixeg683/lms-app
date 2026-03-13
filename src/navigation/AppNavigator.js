import React from "react"

import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import Login from "../screens/Login"
import Signup from "../screens/Signup"
import Dashboard from "../screens/Dashboard"
import CourseList from "../screens/CourseList"
import CourseDetails from "../screens/CourseDetails"

const Stack = createNativeStackNavigator()

export default function AppNavigator() {

  return (

    <NavigationContainer>

      <Stack.Navigator>

        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: "Login" }}
        />

        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ title: "Create Account" }}
        />

        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
        />

        <Stack.Screen
          name="CourseList"
          component={CourseList}
          options={{ title: "Courses" }}
        />

        <Stack.Screen
          name="CourseDetails"
          component={CourseDetails}
          options={{ title: "Course Details" }}
        />

      </Stack.Navigator>

    </NavigationContainer>

  )

}