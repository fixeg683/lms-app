import React from "react";
import { Platform, View, Text, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { 
  createDrawerNavigator, 
  DrawerContentScrollView, 
  DrawerItemList, 
} from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Login from "../screens/Login";
import Signup from "../screens/Signup";
import AdminDashboard from "../screens/AdminDashboard";
import Dashboard from "../screens/Dashboard";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerIcon = (name, color, size) => (
  <MaterialCommunityIcons name={name} color={color} size={size} />
);

// Reusable Custom Drawer content for both Admin and User
function CustomDrawerContent(props, roleName) {
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#f4f4f4', marginBottom: 10 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#2563EB' }}>EduManage Pro</Text>
          <Text style={{ fontSize: 12, color: '#666' }}>{roleName} Portal</Text>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#f4f4f4' }}>
        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}
          onPress={() => {
            props.navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }}
        >
          <MaterialCommunityIcons name="logout" color="#EF4444" size={24} />
          <Text style={{ color: '#EF4444', fontWeight: 'bold', marginLeft: 15 }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 1. Admin Sidebar Navigation
function AdminRoot() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => CustomDrawerContent(props, "Admin")}
      screenOptions={({ navigation }) => ({
        headerShown: true, 
        drawerType: Platform.OS === 'web' ? 'permanent' : 'front',
        drawerStyle: { width: 260, backgroundColor: '#FFFFFF' },
        headerTintColor: "#2563EB",
        drawerActiveTintColor: "#2563EB",
        drawerLabelStyle: { fontWeight: '500', fontSize: 14 },
        headerLeft: () => (
          Platform.OS === 'web' ? null : ( 
            <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 15 }}>
              <MaterialCommunityIcons name="menu" size={26} color="#2563EB" />
            </TouchableOpacity>
          )
        ),
      })}
    >
      <Drawer.Screen name="Dashboard" component={AdminDashboard} options={{ drawerIcon: ({color, size}) => DrawerIcon("view-dashboard-outline", color, size) }} />
      <Drawer.Screen name="Students" component={AdminDashboard} options={{ drawerIcon: ({color, size}) => DrawerIcon("school-outline", color, size) }} />
      <Drawer.Screen name="Subjects" component={AdminDashboard} options={{ drawerIcon: ({color, size}) => DrawerIcon("book-open-variant", color, size) }} />
      <Drawer.Screen name="Grades" component={AdminDashboard} options={{ drawerIcon: ({color, size}) => DrawerIcon("format-list-checks", color, size) }} />
      <Drawer.Screen name="Users" component={AdminDashboard} options={{ drawerIcon: ({color, size}) => DrawerIcon("account-cog-outline", color, size) }} />
      <Drawer.Screen name="Classes" component={AdminDashboard} options={{ drawerIcon: ({color, size}) => DrawerIcon("google-classroom", color, size) }} />
      <Drawer.Screen name="ExamInstances" component={AdminDashboard} options={{ title: "Exam Instances", drawerIcon: ({color, size}) => DrawerIcon("clock-outline", color, size) }} />
      <Drawer.Screen name="Corrections" component={AdminDashboard} options={{ drawerIcon: ({color, size}) => DrawerIcon("file-check-outline", color, size) }} />
      <Drawer.Screen name="Reports" component={AdminDashboard} options={{ drawerIcon: ({color, size}) => DrawerIcon("chart-bar", color, size) }} />
    </Drawer.Navigator>
  );
}

// 2. Standard User Sidebar Navigation
function MainRoot() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => CustomDrawerContent(props, "User")}
      screenOptions={({ navigation }) => ({
        headerShown: true,
        drawerType: Platform.OS === 'web' ? 'permanent' : 'front',
        drawerStyle: { width: 260, backgroundColor: '#FFFFFF' },
        headerTintColor: "#2563EB",
        drawerActiveTintColor: "#2563EB",
        drawerLabelStyle: { fontWeight: '500', fontSize: 14 },
        headerLeft: () => (
          Platform.OS === 'web' ? null : ( 
            <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 15 }}>
              <MaterialCommunityIcons name="menu" size={26} color="#2563EB" />
            </TouchableOpacity>
          )
        ),
      })}
    >
      <Drawer.Screen 
        name="Dashboard" 
        component={Dashboard} 
        options={{ drawerIcon: ({color, size}) => DrawerIcon("home-outline", color, size) }} 
      />
      <Drawer.Screen 
        name="MyGrades" 
        component={Dashboard} 
        options={{ 
          title: "My Grades",
          drawerIcon: ({color, size}) => DrawerIcon("school-outline", color, size) 
        }} 
      />
      <Drawer.Screen 
        name="Reports" 
        component={Dashboard} 
        options={{ drawerIcon: ({color, size}) => DrawerIcon("file-chart-outline", color, size) }} 
      />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="AdminRoot" component={AdminRoot} />
        <Stack.Screen name="Main" component={MainRoot} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}