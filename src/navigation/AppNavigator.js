import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import Login from "../screens/Login";
import Signup from "../screens/Signup";
import AdminDashboard from "../screens/AdminDashboard"; // The sidebar page
import Dashboard from "../screens/Dashboard";           // The student/teacher page

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// This is the Sidebar for Admin
function AdminRoot() {
  return (
    <Drawer.Navigator screenOptions={{ drawerType: 'permanent' }}>
      <Drawer.Screen name="AdminDashboard" component={AdminDashboard} options={{ title: 'Admin Overview' }} />
      {/* Add other sidebar links here (Students, Grades, etc.) */}
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* 1. Auth Flow */}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        
        {/* 2. Admin Flow */}
        <Stack.Screen name="AdminRoot" component={AdminRoot} />
        
        {/* 3. Standard User Flow */}
        <Stack.Screen name="Main" component={Dashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}