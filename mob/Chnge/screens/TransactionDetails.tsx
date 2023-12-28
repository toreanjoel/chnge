import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft,
  faEdit,
  faTrash,
  faThumbsUp,
  faThumbsDown,
} from '@fortawesome/free-solid-svg-icons';
import {VIEWS} from '../constants/views';
import {ref, remove} from 'firebase/database';
import {TransactionRating} from '../types/transactions';
import {useAuth} from '../hooks/useAuth';
import {FIREBASE_DB} from '../config/firebase';

const TransactionDetails = ({navigation, route}) => {
  const {title, description, rating, selectedDate, id} = route.params;
  const {user} = useAuth();

  async function removeTransaction(transactionId: string, date: string) {
    await remove(
      ref(
        FIREBASE_DB,
        `/users/${user.uid}/transactions/history/${date}/items/${transactionId}`,
      ),
    );
    navigation.navigate(VIEWS.HOME);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.goBack()}>
          <FontAwesomeIcon size={22} icon={faArrowLeft} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction Details</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.cardContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <FontAwesomeIcon
            size={22}
            icon={rating === TransactionRating.good ? faThumbsUp : faThumbsDown}
            color={rating === TransactionRating.good ? '#8BC34A' : '#E57373'}
          />
        </View>
        <Text style={styles.description}>{description}</Text>
      </ScrollView>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editItem]}
          onPress={() =>
            navigation.navigate(VIEWS.EDIT_TRANSACTION, route.params)
          }>
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteItem]}
          onPress={() => removeTransaction(id, selectedDate)}>
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#08141E',
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  iconButton: {
    marginRight: 20,
  },
  headerTitle: {
    color: '#F1F6FB',
    fontWeight: '300',
    fontSize: 22,
    flex: 1,
    alignSelf: 'center',
  },
  scrollView: {
    flex: 1,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#212c35',
    borderRadius: 5,
    padding: 20,
  },
  title: {
    fontSize: 20,
    color: '#fff',
  },
  description: {
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
    paddingHorizontal: 10,
    lineHeight: 24,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  deleteItem: {
    backgroundColor: '#E57373',
  },
  editItem: {
    backgroundColor: '#168EE5',
  },
  actionText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default TransactionDetails;
