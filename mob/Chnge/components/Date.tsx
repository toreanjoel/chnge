import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import moment from 'moment';

const Date = ({date, onSelectDate, selected, hasInsight}: any) => {
  const day = moment(date).format('dd').split('')[0];
  const dayNumber = moment(date).startOf('day').format('D');
  const fullDate = moment(date).format('YYYY-MM-DD');

  return (
    <TouchableOpacity
      onPress={() => onSelectDate(fullDate)}
      style={[styles.card, selected === fullDate && styles.selectedStyle]}>
      {hasInsight && <View style={styles.indicator} />}
      <Text
        style={[styles.dayText, selected === fullDate && styles.selectedStyle]}>
        {day}
      </Text>
      <View style={styles.spacer} />
      <Text
        style={[
          styles.dateText,
          selected === fullDate && styles.selectedStyle,
          selected === fullDate
            ? styles.circleDateSelected
            : styles.circleDateNormal,
        ]}>
        {dayNumber}
      </Text>
    </TouchableOpacity>
  );
};

export default Date;

const styles = StyleSheet.create({
  card: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    borderRadius: 25,
    width: 50,
    marginTop: 15,
    marginRight: 10,
    paddingVertical: 8,
    position: 'relative',
  },
  indicator: {
    width: 6,
    height: 6,
    backgroundColor: '#de8133',
    position: 'absolute',
    top: 0,
    right: 8,
    borderRadius: 25,
  },
  dayText: {
    fontWeight: '300',
    fontSize: 14,
    color: '#fff',
  },
  dateText: {
    fontWeight: '300',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedStyle: {
    backgroundColor: '#212c35',
    color: '#fff',
    fontWeight: 'bold',
  },
  spacer: {
    paddingVertical: 8,
  },
  circleDateSelected: {
    backgroundColor: '#168EE5',
    padding: 9,
    fontWeight: '300',
    borderRadius: 25,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    width: 35,
    textAlign: 'center',
  },
  circleDateNormal: {
    backgroundColor: '#212c35',
    padding: 9,
    fontWeight: '300',
    borderRadius: 25,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    width: 35,
    textAlign: 'center',
  },
});
