import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {useAuth} from '../hooks/useAuth';
import {NavigationProp} from '@react-navigation/native';
import {VIEWS} from '../constants/views';
import Calendar from '../components/Calendar';
import moment from 'moment';
import {UserInfo} from 'firebase/auth';
import Transactions from '../components/Transactions';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Stack = createNativeStackNavigator();

const AddTransaction = ({onAdd}: {onAdd: any}) => {
  return (
    <TouchableOpacity style={styles.bottomRight} onPress={onAdd}>
      <Text>ADD</Text>
    </TouchableOpacity>
  );
};

const HomeView = ({navigation}: RouterProps) => {
  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD'),
  );
  const {user}: {user: UserInfo} = useAuth();
  if (!user) return;
  return (
    <View style={styles.center}>
      <View style={styles.spacer} />
      <View style={styles.spacer} />
      <Text style={styles.welcomeText}>Hello, {user.email}</Text>
      <View style={styles.spacer} />
      <View style={styles.spacer} />
      <Calendar onSelectDate={setSelectedDate} selected={selectedDate} />
      <View style={styles.spacer} />
      <Text style={styles.transactionHeader}>Transactions</Text>
      <View style={styles.spacer} />
      <Transactions />
      {/* <Button
        title="details"
        onPress={() => navigation.navigate(VIEWS.VIEW_TRANSACTION)}
      /> */}
      {/* <AddTransaction
        onAdd={() => navigation.navigate(VIEWS.ADD_TRANSACTION)}
      /> */}
    </View>
  );
};

const TransactionDetailsView = () => {
  return <Text>Transaction Details</Text>;
};

/**
 * 1. Stack navigator
 * 2. Add transaction / mood
 * 3. Read transaction / mood
 * 4. Update transaction / mood
 * 5. Delete transaction / mood
 * 6. Add icons
 */

const Home = () => {
  return (
    <Stack.Navigator initialRouteName={VIEWS.HOME} screenOptions={{}}>
      <Stack.Screen
        name={VIEWS.HOME}
        component={HomeView}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={VIEWS.VIEW_TRANSACTION}
        component={TransactionDetailsView}
      />
      <Stack.Screen
        name={VIEWS.ADD_TRANSACTION}
        component={TransactionDetailsView}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  center: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#08141E',
    paddingHorizontal: 15,
  },
  welcomeText: {
    fontSize: 18,
    color: '#fff',
    alignSelf: 'flex-start',
    fontWeight: '200',
  },
  transactionHeader: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '200',
    alignSelf: 'flex-start',
  },
  bottomRight: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  spacer: {
    paddingVertical: 8,
  },
});

export default Home;
