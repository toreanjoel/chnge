import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {onValue, ref} from 'firebase/database';
import {faX} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useAuth} from '../hooks/useAuth';
import {FIREBASE_DB} from '../config/firebase';
import Markdown from 'react-native-markdown-display';

function formattedTextSplit(str: string) {
  return str.replace(/\\n/g, '\n');
}

const DailyGoal = ({navigation, route}: any) => {
  const {user} = useAuth();
  const [dailyGoal, setDailyGoal] = useState(''); // Null for loader?
  const {selectedDate} = route.params;

  useEffect(() => {
    if (user) {
      onValue(
        ref(
          FIREBASE_DB,
          `users/${user.uid}/transactions/history/${selectedDate}/dailyGoal`,
        ),
        querySnapShot => {
          let data = querySnapShot.val() || '';
          setDailyGoal(data);
        },
      );
    }
  }, [user, selectedDate]);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.spacer} />
        <View style={styles.transactionActonContainer}>
          <Text style={styles.headerText}>Daily Goal</Text>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.goBack()}>
            <FontAwesomeIcon size={20} icon={faX} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.spacer} />
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <Markdown style={{body: styles.content}}>
            {formattedTextSplit(dailyGoal)}
          </Markdown>
          <View style={styles.spacer} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backActionWrapper: {
    alignSelf: 'flex-start',
    padding: 5,
  },
  transactionActonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: '#F1F6FB',
    fontWeight: '300',
    fontSize: 25,
    flex: 1,
    alignSelf: 'center',
  },
  actionBtn: {
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#08141E',
    paddingHorizontal: 15,
  },
  spacer: {
    paddingVertical: 10,
  },
  content: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
  },
});
export default DailyGoal;
