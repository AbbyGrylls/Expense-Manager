import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

export const isAuthenticated = async () => {
  const token = await AsyncStorage.getItem('access_token');
  if (!token) return false;

  const decoded = jwtDecode(token);
  if (decoded.exp * 1000 < Date.now()) {
    await AsyncStorage.removeItem('access_token');
    return false;
  }
  return true;
};
/* curl -X POST "http://10.31.25.203:8000/speech/transcribe" ^
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2RjMDJkMTAyYjlmNzU2OTA5YTEzMzEifQ.Q5vqLgvLNSrKhMi2GdsTxobYF9IlG3Cu6UQ0NmqG_04" ^
  -F "file=@C:\Users\susmi\Downloads\testfile2.m4a" */
