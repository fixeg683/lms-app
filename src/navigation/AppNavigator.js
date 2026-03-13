import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Importing screens - ensure these paths match your actual file structure
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import Dashboard from "../screens/Dashboard"; // The converted dashboard
import CourseList from "../screens/CourseList";
import CourseDetails from "../screens/CourseDetails";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF', // Standard EduManage blue
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {/* Auth Screens */}
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: "Login", headerShown: false }} // Hidden header for a cleaner login look
        />

        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ title: "Create Account" }}
        />

        {/* Main App Screens */}
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{ 
            title: "EduManage Dashboard",
            headerLeft: () => null, // Prevents users from "going back" to Login after signing in
          }}
        />

        <Stack.Screen
          name="CourseList"
          component={CourseList}
          options={{ title: "Available Courses" }}
        />

        <Stack.Screen
          name="CourseDetails"
          component={CourseDetails}
          options={{ title: "Course Overview" }}
        />

        {/* Note: If you named the detail screen 'ClassDetails' in the Dashboard code, 
            ensure this name matches or update the Dashboard navigation call. */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}