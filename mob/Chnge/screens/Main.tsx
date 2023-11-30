import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './Home';
import Settings from './Settings';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCog, faGrip} from '@fortawesome/free-solid-svg-icons';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {VIEWS} from '../constants/views';

const Tab = createBottomTabNavigator();

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

const Main = () => {
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
