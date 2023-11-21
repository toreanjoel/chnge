import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './Login';
import Main from './Main';
import Register from './Register';

const Stack = createNativeStackNavigator();

const Auth = () => {
  const isAuthenticated = true;
  const initalRoute = isAuthenticated ? 'Main' : 'Login';
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initalRoute}
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Main" component={Main} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Auth;
