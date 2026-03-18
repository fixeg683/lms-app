import React from "react";
import { Platform, View, Text, TouchableOpacity } from "react-native";
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


// ✅ Custom Burger Button (FIX)
const MenuButton = ({ navigation }) => (
  <TouchableOpacity
    onPress={() => navigation.toggleDrawer()}
    style={{ marginLeft: 15 }}
  >
    <MaterialCommunityIcons name="menu" size={26} color="#2563EB" />
  </TouchableOpacity>
);


// ✅ Sidebar Content
function CustomDrawerContent(props) {
  const roleName = props.roleName || "User";

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        {/* HEADER */}
        <View style={{
          padding: 20,
          borderBottomWidth: 1,
          borderBottomColor: '#f4f4f4',
          marginBottom: 10
        }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#2563EB' }}>
            EduManage Pro
          </Text>
          <Text style={{ fontSize: 12, color: '#666' }}>
            {roleName} Portal
          </Text>
        </View>

        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* LOGOUT */}
      <View style={{
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f4f4f4'
      }}>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}
          onPress={() =>
            props.navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }]
            })
          }
        >
          <MaterialCommunityIcons name="logout" color="#EF4444" size={24} />
          <Text style={{
            color: '#EF4444',
            fontWeight: 'bold',
            marginLeft: 15
          }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


// ✅ COMMON DRAWER OPTIONS (RESPONSIVE FIX)
const getDrawerOptions = (navigation) => ({
  headerShown: true,

  // 🔥 KEY FIX: responsive drawer behavior
  drawerType: Platform.OS === "web" ? "permanent" : "front",

  drawerStyle: {
    width: 260,
  },

  headerTintColor: "#2563EB",
  drawerActiveTintColor: "#2563EB",

  // ✅ Burger menu button
  headerLeft: () => <MenuButton navigation={navigation} />,
});


// ================= ADMIN =================
function AdminRoot() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent {...props} roleName="Admin" />
      )}
      screenOptions={({ navigation }) => getDrawerOptions(navigation)}
    >
      <Drawer.Screen
        name="Dashboard"
        component={AdminDashboard}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="view-dashboard-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Students"
        component={Students}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="school-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Subjects"
        component={Subjects}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="book-open-variant"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Grades"
        component={Grades}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="format-list-checks"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Users"
        component={Users}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-cog-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Classes"
        component={Classes}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="google-classroom"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="ExamInstances"
        component={ExamInstances}
        options={{
          title: "Exam Instances",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="clock-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Corrections"
        component={Corrections}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="file-check-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Reports"
        component={Reports}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="chart-bar"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}


// ================= USER =================
function MainRoot() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent {...props} roleName="User" />
      )}
      screenOptions={({ navigation }) => getDrawerOptions(navigation)}
    >
      <Drawer.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="MyGrades"
        component={Dashboard}
        options={{
          title: "My Grades",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="school-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Reports"
        component={Dashboard}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="file-chart-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Drawer.Navigator>
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
    <Stack.Navigator
      initialRouteName={getInitialRoute()}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="AdminRoot" component={AdminRoot} />
      <Stack.Screen name="Main" component={MainRoot} />
    </Stack.Navigator>
  );
}