import '../config/firebase';
import React from 'react';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuth} from '../hooks/useAuth';
import Login from './Login';
import Main from './Main';
import Register from './Register';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
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

  // here we set the meta data for the user logging
  if (user) {
    // set the online time
    update(ref(FIREBASE_DB, `/users/${user.uid}/metadata`), {
      lastOnline: Date.now(),
    });

    // set the timezone - we do this incase user travels
    update(ref(FIREBASE_DB, `/users/${user.uid}/profile`), {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    // set the current date to make sure on startup we are on the reelvant one
    update(ref(FIREBASE_DB, `/users/${user.uid}/transactions`), {
      current: moment().format('YYYY-MM-DD'),
      selected: moment().format('YYYY-MM-DD'),
    });
  }

  return (
    <View style={styles.navContainer}>
      <NavigationContainer theme={DarkTheme}>
        <Stack.Navigator
          initialRouteName={VIEWS.ONBOARDING}
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
              {/* We need to make sure onboarding happens initially only - store in storage */}
              <Stack.Screen name={VIEWS.ONBOARDING} component={Onboarding} />
              <Stack.Screen name={VIEWS.LOGIN} component={Login} />
              <Stack.Screen name={VIEWS.REGISTER} component={Register} />
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
