import {StyleSheet} from 'react-native';
import React from 'react';
import {NavigationProp} from '@react-navigation/native';
import {OnboardFlow} from 'react-native-onboard';
import {VIEWS} from '../constants/views';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Onboarding = ({navigation}: RouterProps) => {
  return (
    <OnboardFlow
      pages={[
        {
          title: 'Welcome to Chnge!',
          subtitle:
            'Transform your financial decisions with insights powered by behavioral finance. Discover patterns, get timely insights, and manage your finances smarter.',
          imageUri: 'https://placeholder.pics/svg/300x300',
          titleStyle: {color: '#fff', fontWeight: '500'},
          subtitleStyle: {color: '#fff', fontWeight: '300'},
        },
        {
          title: 'Why Chnge?',
          subtitle:
            'Personalized financial notifications, insightful pattern tracking, and easy-to-understand reports. Get ready to see your finances in a new light!',
          imageUri: 'https://placeholder.pics/svg/300x300',
          titleStyle: {color: '#fff', fontWeight: '500'},
          subtitleStyle: {color: '#fff', fontWeight: '300'},
        },
        {
          title: 'Start Your Journey',
          subtitle:
            'Get ready to gain insights about yourself and gather data, leveraging AI to work towards positive financial patterns.',
          imageUri: 'https://placeholder.pics/svg/300x300',
          titleStyle: {color: '#fff', fontWeight: '500'},
          subtitleStyle: {color: '#fff', fontWeight: '300'},
        },
      ]}
      primaryColor="#08141E"
      style={styles.container}
      primaryButtonStyle={styles.btn}
      paginationColor="#fff"
      paginationSelectedColor="#168EE5"
      type={'fullscreen'}
      showDismissButton
      onDone={() => navigation.navigate(VIEWS.LOGIN)}
    />
  );
};

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#168EE5',
  },
  container: {
    backgroundColor: '#08141E',
  },
});

export default Onboarding;
