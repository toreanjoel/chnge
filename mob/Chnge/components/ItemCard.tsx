import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

type Props = {
  pressCard?: () => void;
  deleteCard?: () => void;
  title: string;
  content: string;
};

const ItemCard = ({pressCard, deleteCard, title, content}: Props) => {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={pressCard}>
      <View style={styles.content}>
        <View style={styles.cardActionsWrapper}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
          <TouchableOpacity
            style={styles.cardDeleteAction}
            onPress={deleteCard}>
            <FontAwesomeIcon size={15} icon={faTrash} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text numberOfLines={1} style={styles.subText}>
          {content}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#212c35',
    borderRadius: 5,
    padding: 12,
    marginBottom: 5,
  },
  cardActionsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardActionsWrapperSpacer: {
    flex: 1,
  },
  cardDeleteAction: {
    marginHorizontal: 10,
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
    fontWeight: '300',
  },
  subText: {
    fontWeight: '300',
    flex: 1,
    padding: 5,
    fontSize: 14,
    color: '#fff',
  },
});

export default ItemCard;
