import {View, Text, StyleSheet, Button} from 'react-native';
import React from 'react';

const Login = ({navigation}: {navigation: any}) => {
  return (
    <View style={styles.center}>
      <Text style={styles.blackText}>Login</Text>
      <Button title="Login" onPress={() => navigation.navigate('Main')} />
      <Button
        title="Register"
        onPress={() => navigation.navigate('Register')}
      />
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
});

export default Login;
