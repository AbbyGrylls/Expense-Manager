import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import axios from '../api/axios';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name,setName] = useState('');
  const handleLogin =()=>{
    navigation.replace('Login');
  }
  const handleSignup = async () => {
    try {
      await axios.post('/users/signup', { name,email, password });
      Alert.alert('Success', 'Account created successfully!');
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Signup Failed', 'Could not create account.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <TextInput placeholder='Name'
      value={name}
      onChangeText={setName}
      style={{borderBottomWidth: 1, marginBottom: 10}} />
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
        onPress={handleSignup}
        style={{
          backgroundColor: '#1DA1F2',
          padding: 15,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16 }}>Signup</Text>
      </TouchableOpacity>
      <TouchableOpacity
              onPress={handleLogin}
              style={{
                backgroundColor: '#1DA1F2',
                padding: 15,
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontSize: 16 }}>Use Login</Text>
            </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;
