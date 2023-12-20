import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import Toast from 'react-native-simple-toast';
import {
  faArrowLeft,
  faThumbsUp,
  faThumbsDown,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {VIEWS} from '../constants/views';
import {TransactionRating} from '../types/transactions';
import {ref, update} from 'firebase/database';
import {useAuth} from '../hooks/useAuth';
import {FIREBASE_DB} from '../config/firebase';

const TransactionAdd = ({navigation, route}: any) => {
  const {
    title: tTitle = '',
    description: tDescription = '',
    rating: tRating = 0,
    selectedDate,
    id,
  } = route.params;
  const [title, setTitle] = useState(tTitle);
  const [description, setDescription] = useState(tDescription);
  const [rating, setRating] = useState(tRating);
  const {user} = useAuth();

  // update transaction
  async function updateTransaction() {
    update(
      ref(
        FIREBASE_DB,
        `/users/${user?.uid}/transactions/history/${selectedDate}/items/${id}`,
      ),
      {
        title,
        description,
        rating,
      },
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.transactionActonContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.goBack()}>
          <FontAwesomeIcon size={20} icon={faArrowLeft} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Transaction</Text>
      </View>
      <View style={styles.transactionAddContainer}>
        <ScrollView>
          <View style={styles.inputContainer}>
            <Text style={styles.inputField}>Title</Text>
            <TextInput
              placeholderTextColor={'#6E6E6E'}
              placeholder={'Transacription name'}
              value={title}
              style={styles.input}
              onChangeText={value => setTitle(value)}
            />
            <Text style={styles.inputField}>Description</Text>
            <TextInput
              placeholderTextColor={'#6E6E6E'}
              placeholder={'About the Transaction'}
              multiline
              numberOfLines={10}
              value={description}
              style={styles.inputArea}
              onChangeText={value => setDescription(value)}
            />
            <Text style={styles.inputField}>
              How do you feel about this expense?
            </Text>
            <View style={styles.feelContainer}>
              <TouchableOpacity
                style={[
                  styles.ratingSelection,
                  rating === TransactionRating.bad && styles.ratingActive,
                ]}
                onPress={() => setRating(TransactionRating.bad)}>
                <FontAwesomeIcon size={20} icon={faThumbsDown} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.ratingSelection,
                  rating === TransactionRating.good && styles.ratingActive,
                ]}
                onPress={() => setRating(TransactionRating.good)}>
                <FontAwesomeIcon size={20} icon={faThumbsUp} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.addExpense}
            onPress={() => {
              updateTransaction()
                .then(() =>
                  Toast.show(`Successfully added ${title}`, Toast.SHORT),
                )
                .finally(() => navigation.navigate(VIEWS.HOME));
            }}>
            <Text style={styles.actionText}>Update</Text>
          </TouchableOpacity>
        </View>
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
  transactionActonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  iconButton: {
    marginRight: 20,
  },
  spacer: {
    paddingVertical: 10,
  },
  headerContainer: {
    flex: 1,
  },
  headerTitle: {
    color: '#F1F6FB',
    fontWeight: '300',
    fontSize: 22,
    flex: 1,
    alignSelf: 'center',
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 9,
    padding: 15,
    paddingHorizontal: 20,
    color: '#F1F6FB',
    borderColor: '#6E6E6E',
    marginVertical: 10,
  },
  inputArea: {
    borderWidth: 1,
    borderRadius: 9,
    padding: 15,
    paddingHorizontal: 20,
    color: '#F1F6FB',
    borderColor: '#6E6E6E',
    marginVertical: 10,
    height: 200,
    textAlignVertical: 'top',
  },
  inputField: {
    color: '#F1F6FB',
    paddingTop: 10,
  },
  feelContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 10,
    gap: 20,
  },
  actionContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 10,
    gap: 10,
  },
  ratingSelection: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 9,
    borderColor: '#6E6E6E',
  },
  ratingActive: {
    backgroundColor: '#6E6E6E',
  },
  addExpense: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: '#168EE5',
  },
  transactionAddContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  actionText: {
    color: '#fff',
    fontSize: 18,
  },
});
export default TransactionAdd;
