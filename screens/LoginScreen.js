import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import axios from '../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name,setName] = useState('');
  const handleSignup =()=>{
    navigation.replace('Signup');
  }
  const handleLogin = async () => {
    try {
      const response = await axios.post('/users/login', { name,email, password });
      const { token, userId } = response.data;

      await AsyncStorage.setItem('access_token', token);
      await AsyncStorage.setItem('userId', userId);

      navigation.replace('Main');
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: '#1DA1F2',
          padding: 15,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16 }}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleSignup}
        style={{
          backgroundColor: '#1DA1F2',
          padding: 15,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16 }}>Use Signup</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
