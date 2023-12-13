import '../config/firebase';
import React, {useEffect, useState} from 'react';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuth} from '../hooks/useAuth';
import Login from './Login';
import Main from './Main';
import Register from './Register';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {update, ref} from 'firebase/database';
import {FIREBASE_DB} from '../config/firebase';
import Onboarding from './Onboarding';
import {VIEWS} from '../constants/views';
import TransactionDetails from './TransactionDetails';
import TransactionEdit from './TransactionEdit';
import TransactionAdd from './TransactionAdd';
import moment from 'moment';
import InsightDetails from './InsightDetails';

const Stack = createNativeStackNavigator();

const setOnboardedData = async value => {
  try {
    await AsyncStorage.setItem('ONBOARDED', value);
  } catch (e) {
    // saving error
    console.error('Error saving onboarded data', e);
  }
};

const getOnboardedData = async () => {
  try {
    const value = await AsyncStorage.getItem('ONBOARDED');
    return value !== null;
  } catch (e) {
    // error reading value
    console.error('Error reading onboarded data', e);
    return false;
  }
};

const Auth = () => {
  const {user} = useAuth();
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    (async () => {
      const onboarded = await getOnboardedData();
      setHasOnboarded(onboarded);
      if (!onboarded) {
        setOnboardedData('true');
      }
    })();
  }, []);

  const isAuthenticated = !!user;

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
      <NavigationContainer theme={DarkTheme}>
        <Stack.Navigator
          initialRouteName={
            isAuthenticated
              ? VIEWS.MAIN
              : hasOnboarded
              ? VIEWS.LOGIN
              : VIEWS.ONBOARDING
          }
          screenOptions={{headerShown: false}}>
          {isAuthenticated ? (
            <>
              <Stack.Screen name={VIEWS.MAIN} component={Main} />
              <Stack.Screen
                name={VIEWS.VIEW_INSIGHT}
                component={InsightDetails}
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
