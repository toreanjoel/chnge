import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './Home';
import Settings from './Settings';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCog, faGrip} from '@fortawesome/free-solid-svg-icons';
import messaging from '@react-native-firebase/messaging';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native';
import {VIEWS} from '../constants/views';
import {ref, update} from 'firebase/database';
import {useAuth} from '../hooks/useAuth';
import {FIREBASE_DB} from '../config/firebase';

const Tab = createBottomTabNavigator();
let token: string; // this the token that will be held

function HomeIcon({color, size}: any) {
  return <FontAwesomeIcon icon={faGrip} color={color} size={size} />;
}

function SettingsIcon({color, size}: any) {
  return <FontAwesomeIcon icon={faCog} color={color} size={size} />;
}

function DummyReturn() {
  return null;
}

function MyTabBar({state, descriptors, navigation}: any) {
  return (
    <View style={styles.navigationContainer}>
      {state.routes.map((route: any, index: any) => {
        const {options} = descriptors[route.key];
        const isMiddleButton = index === Math.floor(state.routes.length / 2);
        const isActive = state.index === index;

        const onPress = () => {
          if (isMiddleButton) {
            navigation.navigate(VIEWS.ADD_TRANSACTION);
          } else {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={
              isMiddleButton
                ? styles.fab
                : isActive
                ? styles.activeTab
                : styles.tab
            }>
            {isMiddleButton ? (
              <Text style={styles.addTransactionText}>+</Text>
            ) : (
              options.tabBarIcon({
                color: isActive ? '#168EE5' : '#FFF',
                size: 24,
              })
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// request user permissions
// TODO: we need to use callback to check permissions
const requestUserPermission = async () => {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

  token = (await messaging().getToken()).toString();
  return token;
};

// we create a new token if needed
const getNewFCMToken = async (user: any) => {
  try {
    const push_token = await requestUserPermission();
    update(ref(FIREBASE_DB, `/users/${user?.uid}/metadata`), {
      pushToken: push_token,
    });
  } catch (error) {
    console.error('Error getting new FCM token:', error);
    return false;
  }
};

const Main = () => {
  const {user} = useAuth();
  // we setup listeners once mounted for messages
  useEffect(() => {
    if (user) {
      getNewFCMToken(user);
    }
    // see the app.js to view the background task setup
  }, [user]);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={props => <MyTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: HomeIcon,
        }}
      />
      <Tab.Screen name="Add" component={DummyReturn} />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: SettingsIcon,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  addTransactionText: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '300',
  },
  navigationContainer: {
    flexDirection: 'row',
    backgroundColor: '#08141E',
    borderTopColor: '#212c35',
    borderTopWidth: 1,
    height: 55,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    backgroundColor: '#168EE5',
    width: 60,
    height: 60,
    fontSize: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 20,
    elevation: 4,
  },
  activeTab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Main;
