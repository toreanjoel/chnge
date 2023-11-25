import {View, StyleSheet, Button} from 'react-native';
import React from 'react';
import {FIREBASE_AUTH} from '../config/firebase';

/**
 * 1. Stack navigator - Profile and terms of service
 * 2. List for details
 * 3. signout (bottom sheet)
 */

const Settings = () => {
  const auth = FIREBASE_AUTH;
  return (
    <View style={styles.center}>
      <Button title="Signout" onPress={() => auth.signOut()} />
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#08141E',
    paddingHorizontal: 15,
  },
});

export default Settings;
