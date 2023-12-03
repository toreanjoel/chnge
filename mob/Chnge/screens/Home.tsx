import {View, Text, StyleSheet, FlatList} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useState, useEffect} from 'react';
import {useAuth} from '../hooks/useAuth';
import {NavigationProp} from '@react-navigation/native';
import {VIEWS} from '../constants/views';
import Calendar from '../components/Calendar';
import {TransactionHistory} from '../types/transactions';
import {UserInfo} from 'firebase/auth';
import ItemCard from '../components/ItemCard';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {onValue, ref, update} from 'firebase/database';
import {FIREBASE_DB} from '../config/firebase';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Stack = createNativeStackNavigator();

const HomeView = ({navigation}: RouterProps) => {
  const {user}: {user: UserInfo} = useAuth();
  const [transactions, setTransactions] = useState<TransactionHistory>();
  const [selectedDate, setSelectedDate] = useState();

  // get the initial transactions data
  useEffect(() => {
    if (user) {
      onValue(
        ref(FIREBASE_DB, `users/${user.uid}/transactions/current`),
        querySnapShot => {
          let data = querySnapShot.val() || {};
          setSelectedDate(data);
        },
      );
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      onValue(
        ref(
          FIREBASE_DB,
          `users/${user.uid}/transactions/history/${selectedDate}`,
        ),
        querySnapShot => {
          let data = querySnapShot.val() || {};
          setTransactions(data);
        },
      );
    }
  }, [selectedDate, user]);

  if (!user) {
    return false;
  }

  return (
    <GestureHandlerRootView style={styles.mainContainer}>
      <View style={styles.calendarContainer}>
        <View style={styles.spacer} />
        <View style={styles.spacer} />
        <Calendar
          onSelectDate={(value: any) => {
            update(ref(FIREBASE_DB, `/users/${user.uid}/transactions`), {
              selected: value,
            }).finally(() => setSelectedDate(value));
          }}
          selected={selectedDate}
        />
      </View>

      <View style={styles.transactionsContainer}>
        <View style={styles.spacer} />
        <View
          style={{
            ...(transactions
              ? styles.contentListContainer
              : styles.contentEmptyContainer),
          }}>
          {transactions ? (
            <FlatList
              data={transactions.items}
              renderItem={({item}) => {
                if (!item) {
                  return null;
                }

                return (
                  <ItemCard
                    title={item.title}
                    content={item.description}
                    transactionType={item.type}
                    pressCard={() =>
                      navigation.navigate(VIEWS.VIEW_TRANSACTION, item)
                    }
                  />
                );
              }}
            />
          ) : (
            <Text style={styles.noTransactions}>No Transactions</Text>
          )}
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const Home = () => {
  return (
    <Stack.Navigator initialRouteName={VIEWS.HOME} screenOptions={{}}>
      <Stack.Screen
        name={VIEWS.HOME}
        component={HomeView}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#08141E',
    paddingHorizontal: 15,
    paddingBottom: 20,
    position: 'relative',
  },
  contentListContainer: {},
  contentEmptyContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  bottomRight: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  spacer: {
    paddingVertical: 10,
  },
  noTransactions: {
    color: '#212c35',
    fontSize: 20,
  },
  calendarContainer: {},
  transactionsContainer: {
    flex: 2,
  },
  bottomSheetContainer: {
    flex: 1,
  },
  bottomSheetContentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default Home;
