import {
  View,
  StyleSheet,
  Button,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {NavigationProp} from '@react-navigation/native';
import {FIREBASE_AUTH} from '../config/firebase';
import {VIEWS} from '../constants/views';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const auth = FIREBASE_AUTH;

const Register = ({navigation}: RouterProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loadingNormal, setLoadingNormal] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingApple, setLoadingApple] = useState(false);

  //sign in function
  const socialSignInGoogle = async () => {
    console.log('Continue with social: Google');
  };
  const socialSignInApple = async () => {
    console.log('Continue with social: Apple');
  };

  const signUp = async () => {
    setLoadingNormal(true);
    try {
      if (
        password === confirmPassword &&
        (confirmPassword !== '' || password !== '')
      ) {
        const response = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        console.log(response);
        // here we can send off some request to have emails sent?

        // navigate to home
        navigation.navigate(VIEWS.MAIN);
      } else {
        setErrorMsg('Make sure passwords match and are not empty');
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      setErrorMsg('Make sure details are correct');
      // here there was an error we need to deal with to show and alert the user
    } finally {
      setLoadingNormal(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <View style={styles.navActionContainer}>
          <FontAwesomeIcon size={20} icon={faArrowLeft} color="#fff" />
        </View>
      </TouchableOpacity>
      <View style={styles.spacer} />
      <ScrollView>
        {/* Header container */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Register</Text>
        </View>
        {/* Form inputs */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputField}>Email Address</Text>
          <TextInput
            placeholderTextColor={'#6E6E6E'}
            value={email}
            style={styles.input}
            placeholder="email@domain.here"
            autoCapitalize="none"
            onChangeText={value => setEmail(value)}
          />
          <Text style={styles.inputField}>Password</Text>
          <TextInput
            placeholderTextColor={'#6E6E6E'}
            value={password}
            style={styles.input}
            placeholder="Password"
            autoCapitalize="none"
            onChangeText={value => setPassword(value)}
            secureTextEntry
          />
          <Text style={styles.inputField}>Confirm Password</Text>
          <TextInput
            placeholderTextColor={'#6E6E6E'}
            value={confirmPassword}
            style={styles.input}
            placeholder="Confirm Password"
            autoCapitalize="none"
            onChangeText={value => setconfirmPassword(value)}
            secureTextEntry
          />
        </View>
        {/* Error message */}
        {!!errorMsg && <Text style={styles.errorMsg}>{errorMsg}</Text>}
        {/* Sign up button */}
        {loadingNormal ? (
          <View style={styles.loginBtnLoaderContainer}>
            <ActivityIndicator size="large" color="#168EE5" />
          </View>
        ) : (
          <TouchableOpacity onPress={signUp}>
            <View style={styles.signUpBtnContainer}>
              <Text style={styles.loginBtn}>Sign Up</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Social sign up */}
        <View style={styles.socialsDividerContainer}>
          <View style={styles.socialsDividerLine} />
          <Text style={styles.socialsDividerText}>OR</Text>
          <View style={styles.socialsDividerLine} />
        </View>

        {/* Login button (Google) */}
        <View style={styles.socialSignInContainer}>
          {loadingGoogle ? (
            <View style={styles.loginBtnLoaderContainer}>
              <ActivityIndicator size="large" color="#168EE5" />
            </View>
          ) : (
            <TouchableOpacity disabled onPress={socialSignInGoogle}>
              <View style={styles.loginSocialBtnContainer}>
                <Text style={styles.loginBtn}>Continue with Google</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Login button (Apple) */}
          {loadingApple ? (
            <View style={styles.loginBtnLoaderContainer}>
              <ActivityIndicator size="large" color="#168EE5" />
            </View>
          ) : (
            <TouchableOpacity disabled onPress={socialSignInApple}>
              <View style={styles.loginSocialBtnContainer}>
                <Text style={styles.loginBtn}>Continue with Apple</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  navActionContainer: {
    marginVertical: 20,
    flex: 1,
  },
  spacer: {
    paddingVertical: 10,
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
    justifyContent: 'center',
    height: 100,
  },
  headerText: {
    color: '#F1F6FB',
    fontWeight: '100',
    fontSize: 30,
  },
  inputField: {
    color: '#F1F6FB',
    paddingTop: 10,
    fontWeight: '200',
  },
  inputContainer: {},
  input: {
    borderWidth: 1,
    borderRadius: 9,
    padding: 15,
    paddingHorizontal: 20,
    color: '#F1F6FB',
    borderColor: '#6E6E6E',
    marginVertical: 10,
  },
  signUpBtnContainer: {
    height: 48,
    backgroundColor: '#168EE5',
    borderRadius: 9,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  loginSocialBtnContainer: {
    opacity: 0.3,
    height: 48,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#6E6E6E',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    marginVertical: 10,
  },
  loginBtnLoaderContainer: {
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  loginBtn: {
    color: '#fff',
    fontSize: 15,
  },
  socialsDividerContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  socialsDividerLine: {
    backgroundColor: '#6E6E6E',
    height: 0.5,
    width: 120,
  },
  socialsDividerText: {
    color: '#6E6E6E',
    fontSize: 12,
  },
  socialSignInContainer: {
    marginVertical: 20,
  },
  errorMsg: {
    color: '#F26C6C',
    alignSelf: 'center',
    marginVertical: 5,
    fontSize: 14,
  },
});

export default Register;
