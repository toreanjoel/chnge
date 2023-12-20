import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useState, useEffect} from 'react';
import {useAuth} from '../hooks/useAuth';
import {NavigationProp} from '@react-navigation/native';
import {VIEWS} from '../constants/views';
import Calendar from '../components/Calendar';
import {TransactionHistory} from '../types/transactions';
import ItemCard from '../components/ItemCard';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {onValue, ref, update, remove} from 'firebase/database';
import {FIREBASE_DB} from '../config/firebase';
import InfoCard from '../components/InfoCard';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Stack = createNativeStackNavigator();

const HomeView = ({navigation}: RouterProps) => {
  const {user} = useAuth();
  const [loadingTransactions, setLoadingTransactions] =
    useState<Boolean>(false);
  const [transactions, setTransactions] = useState<TransactionHistory>();
  const [insight, setInsight] = useState<string | undefined>();
  const [dailyGoal, setDailyGoal] = useState<string | undefined>();
  const [selectedDate, setSelectedDate] = useState<string | undefined>();

  // set the current initial date
  useEffect(() => {
    if (user) {
      setLoadingTransactions(true);
      onValue(
        ref(FIREBASE_DB, `users/${user.uid}/transactions/current`),
        querySnapShot => {
          let data = querySnapShot.val() || {};
          setSelectedDate(data);
        },
      );
    }
    setLoadingTransactions(false);
  }, [user]);

  // get transaction date for the selected date
  useEffect(() => {
    if (user) {
      setLoadingTransactions(true);
      // get the insight data along with daily goals if relevant
      onValue(
        ref(
          FIREBASE_DB,
          `users/${user.uid}/transactions/history/${selectedDate}`,
        ),
        querySnapShot => {
          let data = querySnapShot.val() || {};
          setInsight(data.insight);
          setDailyGoal(data.dailyGoal);
          setTransactions(data);
        },
      );
    }
    setLoadingTransactions(false);
  }, [selectedDate, user]);

  if (!user) {
    return false;
  }

  // we check if there are transcations
  function hasTransactions() {
    if (!transactions) {
      return false;
    }
    const {items} = transactions;
    return items ? Object.keys(items).length !== 0 : 0;
  }

  // take a map and return the flatlist with just the data
  function transactionToList(data: TransactionHistory['items']) {
    return Object.keys(data).map(item => {
      return data[item];
    });
  }

  // remove the current item
  async function removeTransaction(
    transactionId: string,
    date: string | undefined,
  ) {
    remove(
      ref(
        FIREBASE_DB,
        `/users/${user.uid}/transactions/history/${date}/items/${transactionId}`,
      ),
    );
  }

  return (
    <GestureHandlerRootView style={styles.mainContainer}>
      <View style={styles.spacer} />
      <View style={styles.calendarContainer}>
        <Calendar
          onSelectDate={(value: any) => {
            update(ref(FIREBASE_DB, `/users/${user.uid}/transactions`), {
              selected: value,
            }).finally(() => setSelectedDate(value));
          }}
          selected={selectedDate}
        />
      </View>

      {/* The grid of goal items here */}
      <View style={[styles.infoCardWrapper]}>
        <Text style={[styles.sectionTitle]}>Insights</Text>
        <View style={styles.spacer} />
        <View style={[styles.infoCards]}>
          <InfoCard
            title="Daily Goal"
            bgColor="#008080"
            data={dailyGoal}
            pressCard={() =>
              navigation.navigate(VIEWS.VIEW_DAILY_GOAL, {selectedDate})
            }
          />
          <InfoCard
            title="Daily Insight"
            bgColor="#4682B4"
            data={insight}
            pressCard={() =>
              navigation.navigate(VIEWS.VIEW_INSIGHT, {selectedDate})
            }
          />
        </View>
      </View>

      <View style={styles.transactionsContainer}>
        <Text style={[styles.sectionTitle]}>Expenses</Text>
        <View style={styles.spacer} />
        <View
          style={{
            ...(hasTransactions()
              ? styles.contentListContainer
              : styles.contentEmptyContainer),
          }}>
          {/* Showing transactions if avail or fallback */}
          {hasTransactions() ? (
            <FlatList
              data={transactions ? transactionToList(transactions.items) : []}
              renderItem={({item}) => {
                if (!item) {
                  return null;
                }
                return (
                  <ItemCard
                    title={item.title}
                    content={item.description}
                    // TODO: use the insight flag
                    // insight={!!insight}
                    deleteCard={() => removeTransaction(item.id, selectedDate)}
                    pressCard={() =>
                      navigation.navigate(VIEWS.VIEW_TRANSACTION, {
                        ...item,
                        selectedDate,
                        id: item.id,
                      })
                    }
                  />
                );
              }}
            />
          ) : (
            <Text style={styles.noTransactions}>
              {loadingTransactions ? (
                <ActivityIndicator size="small" color="#168EE5" />
              ) : (
                'No Transactions'
              )}
            </Text>
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
  infoCardWrapper: {
    marginVertical: 15,
  },
  infoCards: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: '300',
    fontSize: 15,
  },
  contentListContainer: {},
  insightWrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  insightSpacer: {
    flex: 1,
  },
  insight: {
    position: 'absolute',
    right: 0,
    padding: 20,
  },
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
    paddingVertical: 5,
  },
  noTransactions: {
    color: '#212c35',
    fontSize: 20,
  },
  calendarContainer: {
    marginTop: 15,
  },
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
