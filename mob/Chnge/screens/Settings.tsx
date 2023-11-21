import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

const Settings = () => {
  return (
    <View style={styles.center}>
      <Text style={styles.blackText}>Settings</Text>
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

export default Settings;
