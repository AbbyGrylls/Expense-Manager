import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import TabNavigator from './TabNavigator';
import Header from '../components/Header';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';


const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const CustomDrawerContent = ({ navigation }) => (
  <TouchableOpacity
    onPress={() => navigation.replace('Login')}
    style={{
      padding: 12,
      backgroundColor: '#1DA1F2',
      borderRadius: 8,
      marginTop: 20,
      alignItems: 'center',
    }}
  >
    <Text style={{ color: '#fff', fontSize: 16 }}>Logout</Text>
  </TouchableOpacity>
);

const DrawerScreens = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Main"
      component={TabNavigator}
      options={({ navigation }) => ({
        header: () => <Header navigation={navigation} />,
      })}
    />
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Signup"
      component={SignupScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);


const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Drawer.Screen name="DrawerScreens" component={DrawerScreens} />
  </Drawer.Navigator>
);

export default DrawerNavigator;
