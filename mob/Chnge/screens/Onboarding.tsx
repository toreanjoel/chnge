import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {NavigationProp} from '@react-navigation/native';
import {VIEWS} from '../constants/views';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Onboarding = ({navigation}: RouterProps) => {
  return (
    <View style={styles.center}>
      <View style={styles.onboardingImg}>
        <Image source={require('../assets/icon.png')} style={styles.Image} />
      </View>
      <View style={styles.onboardingContainer}>
        {/* <View style={styles.onboardingContent}></View> */}
        <Text style={styles.onboardingTitle}>Shape Your Financial Future</Text>
        <Text style={styles.onboardingBody}>
          Get ready for a transformation in the way you manage your money, keep
          track of your habits and gain insights on yourself.
        </Text>
        <View style={styles.spacer} />
        <View style={styles.onboardingActionsContainer}>
          <TouchableOpacity onPress={() => navigation.navigate(VIEWS.LOGIN)}>
            <View style={styles.loginBtnContainer}>
              <Text style={styles.loginBtn}>I'm Ready</Text>
            </View>
          </TouchableOpacity>
          {/* Register */}
          <View style={styles.createAccountContainer}>
            <Text style={styles.newToAppText}>New to chnge?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(VIEWS.REGISTER)}>
              <Text style={styles.createAccountText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#08141E',
    paddingHorizontal: 10,
  },
  Image: {
    width: 80,
    height: 80,
  },
  onboardingImg: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onboardingContainer: {},
  onboardingContent: {},
  onboardingTitle: {
    color: '#fff',
    fontSize: 24,
    alignSelf: 'center',
    fontWeight: '200',
    height: 40,
    marginVertical: 5,
  },
  onboardingBody: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '200',
    fontSize: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: 25,
    marginVertical: 5,
  },
  loginBtnContainer: {
    height: 48,
    backgroundColor: '#168EE5',
    borderRadius: 9,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtn: {
    color: '#fff',
    fontSize: 15,
  },
  createAccountContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  newToAppText: {
    color: '#6E6E6E',
    fontSize: 15,
  },
  createAccountText: {
    color: '#fff',
    fontSize: 15,
  },
  onboardingActionsContainer: {},
  spacer: {
    padding: 10,
  },
});

export default Onboarding;
