import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import {
  faArrowLeft,
  faEdit,
  faTrash,
  faThumbsUp,
  faThumbsDown,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {VIEWS} from '../constants/views';
import {ref, remove} from 'firebase/database';
import {TransactionRating, TransactionType} from '../types/transactions';
import {useAuth} from '../hooks/useAuth';
import {FIREBASE_DB} from '../config/firebase';

const TransactionDetails = ({navigation, route}: any) => {
  const {title, description, type, rating, selectedDate, id} = route.params;
  const {user} = useAuth();

  // remove the current item
  async function removeTransaction(transactionId: string, date: string) {
    remove(
      ref(
        FIREBASE_DB,
        `/users/${user.uid}/transactions/history/${date}/items/${transactionId}`,
      ),
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.spacer} />
        <View style={styles.transactionActonContainer}>
          <TouchableOpacity
            style={styles.backActionWrapper}
            onPress={() => navigation.goBack()}>
            <FontAwesomeIcon size={20} icon={faArrowLeft} color="#fff" />
          </TouchableOpacity>
          <View style={styles.spacerActionWrapper} />
          <TouchableOpacity
            style={styles.deleteActionWrapper}
            onPress={async () => {
              await removeTransaction(id, selectedDate).then(() => {
                navigation.navigate(VIEWS.HOME, route.params);
              });
            }}>
            <FontAwesomeIcon size={20} icon={faTrash} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editActionWrapper}
            onPress={() =>
              navigation.navigate(VIEWS.EDIT_TRANSACTION, route.params)
            }>
            <FontAwesomeIcon size={20} icon={faEdit} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.spacer} />
        <View
          style={[
            [
              styles.cardContainer,
              type === TransactionType.income
                ? styles.cardBorderIncome
                : styles.cardBorderExpense,
            ],
          ]}>
          <View style={styles.content}>
            <Text numberOfLines={1} style={styles.title}>
              {title}
            </Text>
            <FontAwesomeIcon
              size={20}
              icon={
                rating === TransactionRating.good ? faThumbsUp : faThumbsDown
              }
              color="#fff"
            />
          </View>
        </View>
        <ScrollView>
          <Text style={styles.subText}>{description}</Text>
          <View style={styles.spacer} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  transactionActonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },
  spacerActionWrapper: {
    flex: 1,
  },
  backActionWrapper: {
    alignSelf: 'flex-start',
    padding: 5,
  },
  editActionWrapper: {
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
  deleteActionWrapper: {
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
  navActionContainer: {
    marginVertical: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#08141E',
    paddingHorizontal: 15,
  },
  spacer: {
    paddingVertical: 10,
  },
  cardContainer: {
    height: 60,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#212c35',
    borderRadius: 5,
    padding: 12,
    borderLeftWidth: 5,
    marginBottom: 5,
  },
  cardBorderIncome: {
    borderColor: '#00D585',
  },
  cardBorderExpense: {
    borderColor: '#F26C6C',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingRight: 10,
  },
  title: {
    flex: 1,
    padding: 5,
    fontSize: 19,
    color: '#fff',
  },
  subText: {
    flex: 1,
    padding: 5,
    fontSize: 16,
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
  },
});
export default TransactionDetails;
