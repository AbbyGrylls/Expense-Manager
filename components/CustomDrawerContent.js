import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const CustomDrawerContent = ({ navigation }) => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
    navigation.replace('LoginScreen'); 
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          paddingVertical: 12,
          paddingHorizontal: 24,
          backgroundColor: '#1DA1F2',
          borderRadius: 8,
          alignItems: 'center',
          marginTop: 20,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16 }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomDrawerContent;
