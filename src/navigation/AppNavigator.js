import React from "react";
import { Platform, View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Screens
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import AdminDashboard from "../screens/AdminDashboard";
import Dashboard from "../screens/Dashboard";
import Students from "../screens/Students";
import Subjects from "../screens/Subjects";
import Grades from "../screens/Grades";
import Users from "../screens/Users";
import Classes from "../screens/Classes";
import ExamInstances from "../screens/ExamInstances";
import Corrections from "../screens/Corrections";
import Reports from "../screens/Reports";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// ✅ Custom Burger Button
const MenuButton = ({ navigation }) => (
  <TouchableOpacity
    onPress={() => navigation.toggleDrawer()}
    style={{ marginLeft: 15, padding: 5 }}
  >
    <MaterialCommunityIcons name="menu" size={28} color="#2563EB" />
  </TouchableOpacity>
);

// ✅ Sidebar Content
function CustomDrawerContent(props) {
  const roleName = props.roleName || "User";

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={{
          padding: 20,
          borderBottomWidth: 1,
          borderBottomColor: '#f4f4f4',
          marginBottom: 10
        }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#2563EB' }}>EduManage Pro</Text>
          <Text style={{ fontSize: 12, color: '#666' }}>{roleName} Portal</Text>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#f4f4f4' }}>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}
          onPress={() => props.navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
        >
          <MaterialCommunityIcons name="logout" color="#EF4444" size={24} />
          <Text style={{ color: '#EF4444', fontWeight: 'bold', marginLeft: 15 }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ✅ Main Layout Component to handle Responsive Logic
const ResponsiveDrawer = ({ role, children }) => {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} roleName={role} />}
      screenOptions={({ navigation }) => ({
        headerShown: !isLargeScreen, // Hide header on desktop if sidebar is permanent
        drawerType: isLargeScreen ? "permanent" : "front",
        drawerStyle: {
          width: 260,
          borderRightWidth: 1,
          borderRightColor: '#e5e7eb',
        },
        // ✅ Click outside to close behavior (automatic in "front" type)
        overlayColor: "rgba(0, 0, 0, 0.5)", 
        headerLeft: () => <MenuButton navigation={navigation} />,
        headerTitleAlign: 'center',
        headerTintColor: "#2563EB",
        drawerActiveTintColor: "#2563EB",
      })}
    >
      {children}
    </Drawer.Navigator>
  );
};

// ================= ADMIN =================
function AdminRoot() {
  return (
    <ResponsiveDrawer role="Admin">
      <Drawer.Screen name="Dashboard" component={AdminDashboard} options={{ drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="view-dashboard-outline" color={color} size={size} /> }} />
      <Drawer.Screen name="Students" component={Students} options={{ drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="school-outline" color={color} size={size} /> }} />
      <Drawer.Screen name="Subjects" component={Subjects} options={{ drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="book-open-variant" color={color} size={size} /> }} />
      <Drawer.Screen name="Grades" component={Grades} options={{ drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="format-list-checks" color={color} size={size} /> }} />
      <Drawer.Screen name="Users" component={Users} options={{ drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="account-cog-outline" color={color} size={size} /> }} />
      <Drawer.Screen name="Classes" component={Classes} options={{ drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="google-classroom" color={color} size={size} /> }} />
      <Drawer.Screen name="ExamInstances" component={ExamInstances} options={{ title: "Exams", drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="clock-outline" color={color} size={size} /> }} />
      <Drawer.Screen name="Corrections" component={Corrections} options={{ drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="file-check-outline" color={color} size={size} /> }} />
      <Drawer.Screen name="Reports" component={Reports} options={{ drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="chart-bar" color={color} size={size} /> }} />
    </ResponsiveDrawer>
  );
}

// ================= USER =================
function MainRoot() {
  return (
    <ResponsiveDrawer role="User">
      <Drawer.Screen name="Dashboard" component={Dashboard} options={{ drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="home-outline" color={color} size={size} /> }} />
      <Drawer.Screen name="MyGrades" component={Dashboard} options={{ title: "My Grades", drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="school-outline" color={color} size={size} /> }} />
      <Drawer.Screen name="Reports" component={Dashboard} options={{ drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="file-chart-outline" color={color} size={size} /> }} />
    </ResponsiveDrawer>
  );
}

// ================= ROOT =================
export default function AppNavigator({ session }) {
  const getInitialRoute = () => {
    if (!session || !session.user) return "Login";
    const role = session.user?.user_metadata?.role;
    return role === "admin" ? "AdminRoot" : "Main";
  };

  return (
    <Stack.Navigator initialRouteName={getInitialRoute()} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="AdminRoot" component={AdminRoot} />
      <Stack.Screen name="Main" component={MainRoot} />
    </Stack.Navigator>
  );
}