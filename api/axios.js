import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const instance = axios.create({
  baseURL: 'http://:8000',//add your frontend ip
  timeout: 10000,
});
instance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
