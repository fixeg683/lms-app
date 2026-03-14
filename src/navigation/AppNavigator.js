import React from "react";
import { Platform, View, Text, TouchableOpacity } from "react-native"; // Added TouchableOpacity
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

// Custom Drawer component with fixed Logout logic
function CustomDrawerContent(props) {
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#f4f4f4', marginBottom: 10 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#2563EB' }}>EduManage Pro</Text>
          <Text style={{ fontSize: 12, color: '#666' }}>Admin Panel</Text>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      
      {/* Enhanced Logout Button using TouchableOpacity for better web response */}
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#f4f4f4' }}>
        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}
          onPress={() => {
            // Using reset to completely clear navigation state and return to Login
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

function AdminRoot() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        headerShown: true, 
        // On Web, use 'permanent' to match your screenshot. 
        // On Mobile, use 'front' so the hamburger menu actually works.
        drawerType: Platform.OS === 'web' ? 'permanent' : 'front',
        drawerStyle: { width: 260, backgroundColor: '#FFFFFF' },
        headerTintColor: "#2563EB",
        drawerActiveTintColor: "#2563EB",
        drawerLabelStyle: { fontWeight: '500', fontSize: 14 },
        // Fix for hamburger menu on web/mobile
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
        component={AdminDashboard} 
        options={{ drawerIcon: ({color, size}) => DrawerIcon("view-dashboard-outline", color, size) }} 
      />
      <Drawer.Screen 
        name="Students" 
        component={AdminDashboard} 
        options={{ drawerIcon: ({color, size}) => DrawerIcon("school-outline", color, size) }} 
      />
      <Drawer.Screen 
        name="Subjects" 
        component={AdminDashboard} 
        options={{ drawerIcon: ({color, size}) => DrawerIcon("book-open-variant", color, size) }} 
      />
      <Drawer.Screen 
        name="Grades" 
        component={AdminDashboard} 
        options={{ drawerIcon: ({color, size}) => DrawerIcon("format-list-checks", color, size) }} 
      />
      <Drawer.Screen 
        name="Users" 
        component={AdminDashboard} 
        options={{ drawerIcon: ({color, size}) => DrawerIcon("account-cog-outline", color, size) }} 
      />
      <Drawer.Screen 
        name="Classes" 
        component={AdminDashboard} 
        options={{ drawerIcon: ({color, size}) => DrawerIcon("google-classroom", color, size) }} 
      />
      <Drawer.Screen 
        name="ExamInstances" 
        component={AdminDashboard} 
        options={{ 
          title: "Exam Instances",
          drawerIcon: ({color, size}) => DrawerIcon("clock-outline", color, size) 
        }} 
      />
      <Drawer.Screen 
        name="Corrections" 
        component={AdminDashboard} 
        options={{ drawerIcon: ({color, size}) => DrawerIcon("file-check-outline", color, size) }} 
      />
      <Drawer.Screen 
        name="Reports" 
        component={AdminDashboard} 
        options={{ drawerIcon: ({color, size}) => DrawerIcon("chart-bar", color, size) }} 
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
        <Stack.Screen name="Main" component={Dashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}