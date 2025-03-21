import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Header = ({ navigation }) => (
  <View style={{
    paddingTop: StatusBar.currentHeight + 7,
    height: 80,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
  }}>
    <TouchableOpacity onPress={() => navigation.openDrawer()}>
      <Icon name="person-circle-outline" size={30} color="#000" />
    </TouchableOpacity>
    <Text style={{ marginLeft: 12, fontSize: 18, fontWeight: 'bold' }}>
      Expense Tracker
    </Text>
  </View>
);

export default Header;
