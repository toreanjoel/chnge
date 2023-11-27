import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {NavigationProp} from '@react-navigation/native';
import {
  faBook,
  faCog,
  faSignOut,
  faUser,
  faUserCheck,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {FIREBASE_AUTH} from '../config/firebase';
import {useAuth} from '../hooks/useAuth';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const auth = FIREBASE_AUTH;

const Settings = ({}: RouterProps) => {
  const {user} = useAuth();

  if (!user) return;
  return (
    <View style={styles.container}>
      {/* Header container */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Settings</Text>
      </View>
      <View style={styles.spacer} />
      <TouchableOpacity
        style={styles.buttonWrapper}
        onPress={() => console.log('profile')}>
        <View style={styles.iconWrapper}>
          <FontAwesomeIcon size={15} icon={faUser} color="#fff" />
        </View>
        <Text style={styles.text}>Edit Profile</Text>
      </TouchableOpacity>
      <View style={styles.spacer} />
      <TouchableOpacity
        style={styles.buttonWrapper}
        onPress={() => console.log('settings')}>
        <View style={styles.iconWrapper}>
          <FontAwesomeIcon size={15} icon={faCog} color="#fff" />
        </View>
        <Text style={styles.text}>Settings</Text>
      </TouchableOpacity>
      <View style={styles.spacer} />
      <TouchableOpacity
        style={styles.buttonWrapper}
        onPress={() => console.log('Terms and Conditions')}>
        <View style={styles.iconWrapper}>
          <FontAwesomeIcon size={15} icon={faBook} color="#fff" />
        </View>
        <Text style={styles.text}>Terms & Conditions</Text>
      </TouchableOpacity>
      <View style={styles.spacer} />
      <TouchableOpacity
        style={styles.buttonWrapper}
        onPress={() => console.log('Privacy Policy')}>
        <View style={styles.iconWrapper}>
          <FontAwesomeIcon size={15} icon={faUserCheck} color="#fff" />
        </View>
        <Text style={styles.text}>Privacy Policy</Text>
      </TouchableOpacity>
      <View style={styles.spacer} />
      <TouchableOpacity
        style={styles.buttonWrapper}
        onPress={() => auth.signOut()}>
        <View style={styles.iconWrapper}>
          <FontAwesomeIcon size={15} icon={faSignOut} color="#fff" />
        </View>
        <Text style={styles.text}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navActionContainer: {
    marginVertical: 20,
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#08141E',
    paddingHorizontal: 15,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 100,
  },
  headerText: {
    color: '#F1F6FB',
    fontWeight: '100',
    fontSize: 30,
  },
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 25,
  },
  iconWrapper: {},
  text: {
    color: '#F1F6FB',
    fontSize: 15,
  },
  spacer: {
    borderTopWidth: 1,
    borderColor: '#212c35',
  },
});

export default Settings;
