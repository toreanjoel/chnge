/**
 * @format
 */
import {AppRegistry, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
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
function processInitView(msg) {
  // No message we return
  if (!msg) return;
  // Handle the notification data here and navigate to the specific view
  const {data} = msg;

  // check if data exists
  if (!data) return;

  // We check the view to process
  switch (data.view) {
    case VIEWS.VIEW_INSIGHT:
      console.log("NAVIGATE: INSIGHTS")
      break;
      case VIEWS.VIEW_DAILY_GOAL:
      console.log("NAVIGATE: DAILY GOAL")
      break;
    default:
      break;
  }
}

AppRegistry.registerComponent(appName, () => App);
