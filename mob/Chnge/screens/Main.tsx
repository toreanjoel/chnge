import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './Home';
import Settings from './Settings';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCog, faGrip} from '@fortawesome/free-solid-svg-icons';

const Tab = createBottomTabNavigator();

// Render Icons from memtory
function HomeIcon({color, size}: {color: string; size: number}) {
  return <FontAwesomeIcon icon={faGrip} color={color} size={size} />;
}
function SettingsIcon({color, size}: {color: string; size: number}) {
  return <FontAwesomeIcon icon={faCog} color={color} size={size} />;
}

const Main = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#168EE5',
        tabBarInactiveTintColor: '#212c35',
        tabBarStyle: {
          backgroundColor: '#08141E',
          borderTopColor: '#212c35',
          borderTopWidth: 1,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({color, size}) => HomeIcon({color, size}),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({color, size}) => SettingsIcon({color, size}),
        }}
      />
    </Tab.Navigator>
  );
};

export default Main;
