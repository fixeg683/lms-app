import React from "react";
import { Platform, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { 
  createDrawerNavigator, 
  DrawerContentScrollView, 
  DrawerItemList, 
  DrawerItem 
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

// Custom Drawer component to handle Logout
function CustomDrawerContent(props) {
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#f4f4f4' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#2563EB' }}>EduManage Pro</Text>
          <Text style={{ fontSize: 12, color: '#666' }}>Admin Panel</Text>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#f4f4f4' }}>
        <DrawerItem
          label="Logout"
          labelStyle={{ color: '#EF4444', fontWeight: 'bold' }}
          icon={({ size }) => <MaterialCommunityIcons name="logout" color="#EF4444" size={size} />}
          onPress={() => props.navigation.replace('Login')}
        />
      </View>
    </View>
  );
}

function AdminRoot() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true, 
        drawerType: Platform.OS === 'web' ? 'permanent' : 'front',
        drawerStyle: { width: 260, backgroundColor: '#FFFFFF' },
        headerTintColor: "#2563EB",
        drawerActiveTintColor: "#2563EB",
        drawerLabelStyle: { fontWeight: '500', fontSize: 14 }
      }}
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