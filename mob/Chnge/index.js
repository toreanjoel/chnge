/**
 * @format
 */
import {AppRegistry, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import {name as appName} from './app.json';
import {NOTIFICATION_CHANNEL} from './constants/notifications';

// register the background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

// get the message and initialize the app with it
messaging().getInitialNotification(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
