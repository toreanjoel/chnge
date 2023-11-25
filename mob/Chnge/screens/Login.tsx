import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {NavigationProp} from '@react-navigation/native';
import {FIREBASE_AUTH} from '../config/firebase';
import {VIEWS} from '../constants/views';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Login = ({navigation}: RouterProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loadingNormal, setLoadingNormal] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingApple, setLoadingApple] = useState(false);

  const auth = FIREBASE_AUTH;

  //sign in function
  const socialSignInGoogle = async () => {
    console.log('Continue with social: Google');
  };
  const socialSignInApple = async () => {
    console.log('Continue with social: Apple');
  };

  const signIn = async () => {
    setLoadingNormal(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      // here we can send off some request to have emails sent?

      // navigate to home
      navigation.navigate(VIEWS.MAIN);
    } catch (error) {
      console.log(`Error: ${error}`);
      // here there was an error we need to deal with to show and alert the user
      setErrorMsg('Make sure details is correct and try again');
    } finally {
      setLoadingNormal(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Header container */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Log In</Text>
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
      </View>

      {/* Error message */}
      {!!errorMsg && <Text style={styles.errorMsg}>{errorMsg}</Text>}

      {/* Login button */}
      {loadingNormal ? (
        <View style={styles.loginBtnLoaderContainer}>
          <ActivityIndicator size="large" color="#168EE5" />
        </View>
      ) : (
        <TouchableOpacity onPress={signIn}>
          <View style={styles.loginBtnContainer}>
            <Text style={styles.loginBtn}>Log In</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Forgot Password */}
      <View style={styles.forgotPasswordContainer}>
        <TouchableOpacity
          onPress={() => console.log('Navigate: Forgot Password')}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Register */}
      <View style={styles.createAccountContainer}>
        <Text style={styles.newToAppText}>New to chnge?</Text>
        <TouchableOpacity onPress={() => navigation.navigate(VIEWS.REGISTER)}>
          <Text style={styles.createAccountText}>Create Account</Text>
        </TouchableOpacity>
      </View>

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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
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
  forgotPasswordContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  forgotPasswordText: {
    color: '#fff',
    fontSize: 15,
  },
  loginBtnContainer: {
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
  createAccountContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newToAppText: {
    color: '#6E6E6E',
    fontSize: 15,
  },
  createAccountText: {
    color: '#fff',
    fontSize: 15,
    padding: 5,
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

export default Login;
