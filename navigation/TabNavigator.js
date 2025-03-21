import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import AddScreen from '../screens/AddScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'Home') iconName = 'home-outline';
        else if (route.name === 'Add') iconName = 'add-circle-outline';
        else if (route.name === 'Statistics') iconName = 'bar-chart-outline';
        else if (route.name === 'Notifications') iconName = 'notifications-outline';

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#1DA1F2',
      tabBarInactiveTintColor: '#aaa',
      tabBarShowLabel: false,
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Add" component={AddScreen} />
    <Tab.Screen name="Statistics" component={StatisticsScreen} />
    <Tab.Screen name="Notifications" component={NotificationsScreen} />
  </Tab.Navigator>
);

export default TabNavigator;
