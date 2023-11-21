import {View, Text, Button, StyleSheet} from 'react-native';
import React from 'react';

// Add the onboarding screens here before going to the login screen
const Onboarding = ({navigation}: {navigation: any}) => {
  return (
    <View style={styles.center}>
      <Text style={styles.blackText}>Onboarding</Text>
      <Button
        title="Go to Login"
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

export default Onboarding;
