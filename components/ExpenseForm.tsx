import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';
import axios from '../api/axios.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useExpenseContext } from '../contexts/ExpenseContext.js';

export default function ExpenseForm() {
  const [userId, setUserId] = useState(null);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [isCredit, setIsCredit] = useState(null);
  const [date, setDate] = useState(new Date().toISOString());
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const { dispatch } = useExpenseContext();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) setUserId(storedUserId);
      } catch (error) {
        console.error('Error fetching userId:', error);
      }
    };
    fetchUserId();
  }, []);
  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert('Error', 'Permission to access microphone is required');
        return;
      }

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await newRecording.startAsync();
      setRecording(newRecording);
      setIsRecording(true);
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
      setRecording(null);
      setIsRecording(false);

      if (!uri) {
        Alert.alert('Error', 'No recording found');
        return;
      }

      await sendAudioToBackend(uri);
    } catch (error) {
      console.error('Stop Recording Error:', error);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const sendAudioToBackend = async (audioUri: string) => {
    const file = { uri: audioUri, type: 'audio/m4a', name: 'audio.m4a' };
    const formData = new FormData();
    // @ts-ignore
    formData.append('file', file);

    try {
      const response = await axios.post('/speech/transcribe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { transcript, extracted_data } = response.data;
      let extractedAmount = extracted_data.amount; 
      let extractedCategory = extracted_data.category;

      if (extractedAmount !== undefined) {
        const isCredit = extractedAmount >= 0; 
        setAmount(Math.abs(extractedAmount).toString());
        setIsCredit(isCredit); 
      }

      setCategory(extractedCategory);
    } catch (error) {
      console.error('Transcription Error:', error);
      Alert.alert('Error', 'Failed to transcribe audio');
    }
  };

  const handleSubmit = async () => {
    if (!amount || !category || isCredit === null) {
      Alert.alert('Error', 'Please fill all fields and select Debit or Credit');
      return;
    }

    const finalAmount = isCredit ? parseFloat(amount) : -parseFloat(amount);

    const expenseData = {
      userId,
      amount: finalAmount,
      category,
      date: new Date(date).toISOString(),
      notes: '',
    };

    try {
      const res = await axios.post('/expenses/', expenseData);
      dispatch({ type: 'CREATE_EXPENSE', payload: res.data });
      Alert.alert('Success', 'Expense added successfully');
      
      setAmount('');
      setCategory('');
      setIsCredit(null);
    } catch (error) {
      console.error('Error adding expense:', error.response?.data || error.message);
      Alert.alert('Oops!', 'Something went wrong, please try again');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Amount:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter amount"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Category:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter category"
        value={category}
        onChangeText={setCategory}
      />

      <Text style={styles.label}>Transaction Type:</Text>
      <View style={styles.buttonContainer}>
        <Button title="Debit (-)" onPress={() => setIsCredit(false)} color={isCredit === false ? 'red' : 'gray'} />
        <Button title="Credit (+)" onPress={() => setIsCredit(true)} color={isCredit === true ? 'green' : 'gray'} />
      </View>

      <Text style={styles.dateText}>Date: {new Date(date).toLocaleString()}</Text>

      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={isRecording ? stopRecording : startRecording} style={styles.icon}>
          {isRecording ? (
            <MaterialIcons name="stop" size={30} color="red" />
          ) : (
            <MaterialIcons name="mic" size={30} color="black" />
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.icon}>
          <MaterialIcons name="qr-code-scanner" size={30} color="gray" />
        </TouchableOpacity>
      </View>
      {isRecording && <Text style={styles.recordingText}>Recording...</Text>}
      <Button title="Submit Expense" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateText: {
    marginTop: 10,
    fontSize: 14,
    color: 'gray',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  icon: {
    marginHorizontal: 20,
  },
  recordingText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
    marginBottom: 10,
  },
});

