import React, { useState } from 'react';
import { View, Button, Text, TextInput, Alert } from 'react-native';
import { Audio } from 'expo-av';
import axios from '../api/axios';

const SpeechInput = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recognizedText, setRecognizedText] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false); 

  
  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert('Error', 'Permission to access microphone is required');
        return;
      }

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await newRecording.startAsync();
      setRecording(newRecording);
      setIsReadyToSubmit(false);
    } catch (error) {
      console.error('Start Recording Error:', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };
  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      if (!uri) {
        Alert.alert('Error', 'No recording found');
        return;
      }

      setRecording(null);
      await sendAudioToBackend(uri);
    } catch (error) {
      console.error('Stop Recording Error:', error);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };
  const sendAudioToBackend = async (audioUri: string) => {
    const file = {
      uri: audioUri,
      type: 'audio/m4a',
      name: 'audio.m4a',
    };

    const formData = new FormData();
    
    // @ts-ignore
    formData.append('file', file);

    try {
      const response = await axios.post('/speech/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { transcript, extracted_data } = response.data;
      setRecognizedText(transcript);
      setAmount(extracted_data.amount.toString());
      setCategory(extracted_data.category);
      setIsReadyToSubmit(true); 
    } catch (error) {
      console.error('Transcription Error:', error);
      Alert.alert('Error', 'Failed to transcribe audio');
    }
  };
  const handleSubmit = async () => {
    if (!amount || !category) {
      Alert.alert('Error', 'Please enter valid amount and category before submitting');
      return;
    }

    try {
      await axios.post('/expenses', {
        amount: parseFloat(amount),
        category,
      });
      Alert.alert('Success', 'Expense saved successfully');
      setRecognizedText('');
      setAmount('');
      setCategory('');
      setIsReadyToSubmit(false);
    } catch (error) {
      console.error('Save Expense Error:', error);
      Alert.alert('Error', 'Failed to save expense');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Start Recording" onPress={startRecording} disabled={recording !== null} />
      <Button title="Stop Recording" onPress={stopRecording} disabled={recording === null} />

      <Text>Recognized Text:</Text>
      <Text>{recognizedText || 'No transcription yet'}</Text>

      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />

      {isReadyToSubmit && (
        <Button title="Submit" onPress={handleSubmit} />
      )}
    </View>
  );
};

export default SpeechInput;
