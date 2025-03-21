import React from 'react';
import { View, Text } from 'react-native';
import SpeechInput from '../components/SpeechInput';

const HomeScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <SpeechInput />
  </View>
);

export default HomeScreen;
