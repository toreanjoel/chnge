import '../config/firebase';
import React, {useEffect, useRef, useState} from 'react';
import {
  NavigationContainer,
  DarkTheme,
  NavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuth} from '../hooks/useAuth';
import Login from './Login';
import Main from './Main';
import Register from './Register';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {update, ref} from 'firebase/database';
import {FIREBASE_DB} from '../config/firebase';
import Onboarding from './Onboarding';
import {VIEWS} from '../constants/views';
import TransactionDetails from './TransactionDetails';
import TransactionEdit from './TransactionEdit';
import TransactionAdd from './TransactionAdd';
import moment from 'moment';
import DailyInsight from './DailyInsight';
import DailyGoal from './DailyGoal';

const Stack = createNativeStackNavigator();

const Auth = () => {
  const {user} = useAuth();
  const isAuthenticated = !!user;
  const navigationRef = useRef<NavigationContainerRef>(null);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  // Check the init views
  function initView() {
    return hasOnboarded ? VIEWS.MAIN : VIEWS.ONBOARDING;
  }

  useEffect(() => {
    const checkOnboarding = async () => {
      const onboarded = await AsyncStorage.getItem('ONBOARDED');

      if (onboarded) {
        await AsyncStorage.setItem('ONBOARDED', 'true');
      }

      setHasOnboarded(!!onboarded);
    };

    checkOnboarding();
  }, []);

  if (user === undefined) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#168EE5" />
      </View>
    );
  }

  // User metadata update logic here
  if (user) {
    // set the online time
    update(ref(FIREBASE_DB, `/users/${user.uid}/metadata`), {
      lastOnline: Date.now(),
    });

    // set the timezone - we do this in case user travels
    update(ref(FIREBASE_DB, `/users/${user.uid}/profile`), {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    // set the current date to make sure on startup we are on the relevant one
    update(ref(FIREBASE_DB, `/users/${user.uid}/transactions`), {
      current: moment().format('YYYY-MM-DD'),
      selected: moment().format('YYYY-MM-DD'),
    });
  }

  return (
    <View style={styles.navContainer}>
      <NavigationContainer
        theme={DarkTheme}
        ref={navigationRef}
        onReady={async () => {
          // We navigate to any pending view we had in memory
          const pendingView = await AsyncStorage.getItem('PENDING_VIEW');
          if (pendingView && navigationRef.current) {
            const screen = pendingView.split(':')[0];
            const date = pendingView.split(':')[1];
            // Perform the navigation
            navigationRef.current.navigate(screen, {selectedDate: date});
            // Clear the AsyncStorage item
            await AsyncStorage.removeItem('PENDING_VIEW');
          }
        }}>
        <Stack.Navigator
          initialRouteName={isAuthenticated ? initView() : VIEWS.LOGIN}
          screenOptions={{headerShown: false}}>
          {isAuthenticated ? (
            <>
              <Stack.Screen name={VIEWS.ONBOARDING} component={Onboarding} />
              <Stack.Screen name={VIEWS.MAIN} component={Main} />
              <Stack.Screen
                name={VIEWS.VIEW_INSIGHT}
                component={DailyInsight}
              />
              <Stack.Screen
                name={VIEWS.VIEW_DAILY_GOAL}
                component={DailyGoal}
              />
              <Stack.Screen
                name={VIEWS.VIEW_TRANSACTION}
                component={TransactionDetails}
              />
              <Stack.Screen
                name={VIEWS.EDIT_TRANSACTION}
                component={TransactionEdit}
              />
              <Stack.Screen
                name={VIEWS.ADD_TRANSACTION}
                component={TransactionAdd}
              />
            </>
          ) : (
            <>
              <Stack.Screen name={VIEWS.LOGIN} component={Login} />
              <Stack.Screen name={VIEWS.REGISTER} component={Register} />
              <Stack.Screen name={VIEWS.ONBOARDING} component={Onboarding} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#08141E',
  },
  navContainer: {
    backgroundColor: '#08141E',
    flex: 1,
  },
});

export default Auth;
