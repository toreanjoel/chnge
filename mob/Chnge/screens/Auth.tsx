import '../config/firebase';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuth} from '../hooks/useAuth';
import Login from './Login';
import Main from './Main';
import Register from './Register';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

const Stack = createNativeStackNavigator();

const Auth = () => {
  const {user} = useAuth();
  console.log('user', user);
  const isAuthenticated = !!user;
  const initalRoute = isAuthenticated ? 'Main' : 'Login';

  if (user === undefined) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initalRoute}
        screenOptions={{headerShown: false}}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={Main} />
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});

export default Auth;
