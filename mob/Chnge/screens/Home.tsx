import {View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native';
import React from 'react';

const AddTransaction = () => {
  return (
    <TouchableOpacity
      style={styles.bottomRight}
      onPress={() => console.log('Adding Transaction Bottom sheet')}>
      <Text style={styles.blackText}>ADD</Text>
    </TouchableOpacity>
  );
};

const Home = ({navigation}: {navigation: any}) => {
  return (
    <View style={styles.center}>
      <Text style={styles.blackText}>Home</Text>
      <Button title="Signout" onPress={() => navigation.navigate('Login')} />
      <AddTransaction />
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blackText: {
    color: '#000',
  },
  bottomRight: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});

export default Home;
