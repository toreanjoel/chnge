import {View, Text, StyleSheet, Button} from 'react-native';
import React from 'react';

const Register = ({navigation}: {navigation: any}) => {
  return (
    <View style={styles.center}>
      <Text style={styles.blackText}>Register</Text>
      <Button
        title="Back To Login"
        onPress={() => navigation.navigate('Login')}
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

export default Register;
