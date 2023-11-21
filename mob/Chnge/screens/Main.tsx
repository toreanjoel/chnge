import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './Home';
import Settings from './Settings';

const Tab = createBottomTabNavigator();

const Main = () => {
  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
      <Tab.Screen name="Home" component={Home} options={{}} />
      <Tab.Screen name="Settings" component={Settings} options={{}} />
    </Tab.Navigator>
  );
};

export default Main;
