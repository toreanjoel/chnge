import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

type Props = {
  pressCard?: () => void;
  title: string;
  content: string;
  isIncome: boolean;
};

const ItemCard = ({pressCard, title, content, isIncome = false}: Props) => {
  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        isIncome ? styles.cardBorderIncome : styles.cardBorderExpense,
      ]}
      onPress={pressCard}>
      <View style={styles.bar} />
      <View style={styles.content}>
        <Text
          style={[
            styles.tagContainer,
            isIncome ? styles.tagIncome : styles.tagExpense,
          ]}>
          Income
        </Text>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <Text numberOfLines={1} style={styles.subText}>
          {content}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    height: 120,
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
  bar: {},
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
  tagContainer: {
    borderRadius: 4,
    fontWeight: '500',
    paddingHorizontal: 10,
    paddingVertical: 5,
    display: 'flex',
    textAlign: 'center',
    width: 70,
  },
  tagIncome: {
    backgroundColor: '#1E3D3D',
    color: '#00D585',
  },
  tagExpense: {
    backgroundColor: '#3D2727',
    color: '#F26C6C',
  },
});

export default ItemCard;
