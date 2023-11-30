import {View, Text, StyleSheet, FlatList, Button} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useRef, useState, useMemo, useCallback} from 'react';
import {useAuth} from '../hooks/useAuth';
import {NavigationProp} from '@react-navigation/native';
import {VIEWS} from '../constants/views';
import Calendar from '../components/Calendar';
import moment from 'moment';
import {UserInfo} from 'firebase/auth';
import ItemCard from '../components/ItemCard';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Stack = createNativeStackNavigator();
const DATA = [
  {
    title: 'Mystical Mountains',
    content: 'Exploring the serene beauty of the Himalayas.',
    isIncome: false,
  },
  {
    title: 'Tech Trends',
    content: 'Latest advancements in artificial intelligence.',
    isIncome: true,
  },
  {
    title: 'Healthy Eating',
    content: 'Discovering the benefits of a plant-based diet.',
    isIncome: true,
  },
  {
    title: 'Space Odyssey',
    content: 'The future of space travel and exploration.',
    isIncome: false,
  },
  {
    title: 'Investing 101',
    content: 'Basics of investing in the stock market for beginners.',
    isIncome: true,
  },
  {
    title: 'Global Culture',
    content: 'Understanding diverse cultures around the world.',
    isIncome: true,
  },
  {
    title: 'Ocean Depths',
    content: 'Unveiling the mysteries of the deep sea.',
    isIncome: false,
  },
];

const HomeView = ({navigation}: RouterProps) => {
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '70%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback(() => {
    console.log('handleSheetChanges');
  }, []);

  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD'),
  );

  const {user}: {user: UserInfo} = useAuth();

  if (!user) return;
  return (
    <GestureHandlerRootView style={styles.mainContainer}>
      <View style={styles.calendarContainer}>
        <View style={styles.spacer} />
        <View style={styles.spacer} />
        <Calendar onSelectDate={setSelectedDate} selected={selectedDate} />
      </View>

      <View style={styles.transactionsContainer}>
        {/* Tis is the overview view - generated to view with AI for the current day */}
        {/* TODO: conditionally show if there is data */}
        {/* <View style={styles.spacer} /> */}
        {/* <Button
          onPress={() => handlePresentModalPress()}
          title="Daily Overview"
        /> */}
        <View style={styles.spacer} />
        <View
          style={{
            ...(!!DATA.length
              ? styles.contentListContainer
              : styles.contentEmptyContainer),
          }}>
          {!!DATA.length ? (
            <FlatList
              data={DATA}
              renderItem={({item}) => (
                <ItemCard
                  title={item.title}
                  content={item.content}
                  isIncome={item.isIncome}
                  pressCard={() =>
                    navigation.navigate(VIEWS.VIEW_TRANSACTION, item)
                  }
                />
              )}
            />
          ) : (
            <Text style={styles.noTransactions}>No Transactions</Text>
          )}
        </View>
      </View>

      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}>
          <View style={styles.bottomSheetContentContainer}>
            <Text>
              Daily overview will come here with what happened and what can be
              done better
            </Text>
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>
      {/* </View> */}
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
