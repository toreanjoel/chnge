import '../config/firebase';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuth} from '../hooks/useAuth';
import Login from './Login';
import Main from './Main';
import Register from './Register';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import Onboarding from './Onboarding';
import {VIEWS} from '../constants/views';

const Stack = createNativeStackNavigator();

const Auth = () => {
  const {user} = useAuth();
  const isAuthenticated = !!user;

  if (user === undefined) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#168EE5" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={VIEWS.ONBOARDING}
        screenOptions={{headerShown: false, animation: 'fade'}}>
        {isAuthenticated ? (
          <Stack.Screen name={VIEWS.MAIN} component={Main} />
        ) : (
          <>
            {/* We need to make sure onboarding happens initially only - store in storage */}
            <Stack.Screen name={VIEWS.ONBOARDING} component={Onboarding} />
            <Stack.Screen name={VIEWS.LOGIN} component={Login} />
            <Stack.Screen name={VIEWS.REGISTER} component={Register} />
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
    backgroundColor: '#08141E',
  },
});

export default Auth;
