import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import moment from 'moment';
import Date from './Date';

const Calendar = ({onSelectDate, selected, insight}: any) => {
  const [dates, setDates] = useState<any>([]);
  const [scrollPosition, setScrollPosition] = useState<any>(0);
  const [currentMonth, setCurrentMonth] = useState<any>();
  const scrollViewRef = useRef();
  // get the dates from today to 10 days from now, format them as strings and store them in state
  const getDates = () => {
    const dateRange = [];
    for (let i = 0; i < 7; i++) {
      const prevDays = moment().subtract(i, 'days');
      dateRange.push(prevDays);
    }
    setDates(dateRange);
  };

  const getCurrentMonth = () => {
    const month = moment().format('DD MMMM YYYY');
    setCurrentMonth(month);
  };

  useEffect(() => {
    getCurrentMonth();
  }, []);

  useEffect(() => {
    getDates();
  }, []);

  return (
    <>
      <View style={styles.centered}>
        <Text style={styles.title}>{currentMonth}</Text>
      </View>
      <View style={styles.dateSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          // onScroll is a native event that returns the number of pixels the user has scrolled
          onScroll={e => setScrollPosition(e.nativeEvent.contentOffset.x)}
          scrollEventThrottle={5}>
          {dates.map((date: any, index: any) => (
            <Date
              key={index}
              date={date}
              onSelectDate={onSelectDate}
              selected={selected}
              hasInsight={!!insight}
            />
          ))}
        </ScrollView>
      </View>
    </>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '200',
    color: '#fff',
    // fontWeight: 'bold',
  },
  dateSection: {
    width: '100%',
  },
});
