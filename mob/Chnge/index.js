/**
 * @format
 */
import {AppRegistry, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import App from './App';
import {name as appName} from './app.json';
import {VIEWS} from './constants/views';

// register the background handler
messaging().setBackgroundMessageHandler(async msg => {
  // We can use this to process background tasks here
  console.log('Message handled in the background!', msg);
});

// get the message and initialize the app with it
messaging()
  .getInitialNotification()
  .then(async msg => {
    processInitView(msg);
  });

// User tapped on the message and we are opening it
messaging().onNotificationOpenedApp(async msg => {
  processInitView(msg);
});

// helpers navigate based off view
const processInitView = async (msg) => {
  // No message we return
  if (!msg) return;
  // Handle the notification data here and navigate to the specific view
  const {data} = msg;

  // check if data exists
  if (!data) return;

  console.log(data);

  // We check the view to process
  switch (data.view) {
    case VIEWS.VIEW_INSIGHT:
      try {
        await AsyncStorage.setItem('PENDING_VIEW', `${VIEWS.VIEW_INSIGHT}:${data.date}`);
      } catch (e) {
        // saving error
        console.error('Error saving pending view data', e);
      }
      break;
    case VIEWS.VIEW_DAILY_GOAL:
      try {
        await AsyncStorage.setItem('PENDING_VIEW', `${VIEWS.VIEW_DAILY_GOAL}:${data.date}`);
      } catch (e) {
        // saving error
        console.error('Error saving pending view data', e);
      }
      break;
    default:
      break;
  }
};

AppRegistry.registerComponent(appName, () => App);
