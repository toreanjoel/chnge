import {
  View,
  StyleSheet,
  Button,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState} from 'react';
import {signInWithEmailAndPassword, getAuth} from 'firebase/auth';
import {NavigationProp} from '@react-navigation/native';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Login = ({navigation}: RouterProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  //sign in function
  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      // here we can send off some request to have emails sent?

      // navigate to home
      navigation.navigate('Main');
    } catch (error) {
      console.log(`Error: ${error}`);
      // here there was an error we need to deal with to show and alert the user
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.center}>
      <KeyboardAvoidingView behavior="padding">
        <TextInput
          value={email}
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={value => setEmail(value)}
        />
        <TextInput
          value={password}
          style={styles.input}
          placeholder="Password"
          autoCapitalize="none"
          onChangeText={value => setPassword(value)}
        />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title="Login" onPress={() => signIn()} />
        )}
        <Button
          title="Register"
          onPress={() => navigation.navigate('Register')}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    color: '#000',
  },
});

export default Login;
