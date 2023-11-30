import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import {faArrowLeft, faEdit} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {VIEWS} from '../constants/views';

const TransactionDetails = ({navigation, route}: any) => {
  const {title, content, isIncome} = route.params;
  const [transactionData, setTransactionData] = useState({
    title,
    content,
    isIncome,
  });

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
            style={styles.editActionWrapper}
            onPress={() => navigation.navigate(VIEWS.EDIT_TRANSACTION)}>
            <FontAwesomeIcon size={20} icon={faEdit} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.spacer} />
        <View
          style={[
            [
              styles.cardContainer,
              isIncome ? styles.cardBorderIncome : styles.cardBorderExpense,
            ],
          ]}>
          <View style={styles.content}>
            <Text numberOfLines={1} style={styles.title}>
              {title}
            </Text>
          </View>
        </View>
        <Text style={styles.subText}>{content}</Text>
      </View>
      <View style={styles.moodContainer}>
        <Text style={styles.moodText}>rating</Text>
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
    alignSelf: 'flex-start',
    padding: 5,
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
  },
  title: {
    flex: 1,
    padding: 5,
    fontSize: 19,
    color: '#fff',
    // fontWeight: '300',
  },
  subText: {
    // fontWeight: '300',
    flex: 1,
    padding: 5,
    fontSize: 16,
    color: '#fff',
  },
  moodText: {
    color: '#fff',
  },
  moodContainer: {
    backgroundColor: '#212c35',
    padding: 20,
    marginBottom: 10,
  },
  contentContainer: {
    flex: 1,
  },
});
export default TransactionDetails;
