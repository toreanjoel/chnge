import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

function formattedTextSplit(str: string) {
  return str.replace(/\\n/g, '\n');
}

const InsightDetails = ({navigation, route}: any) => {
  const {details, selectedDate} = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.spacer} />
        <View style={styles.transactionActonContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesomeIcon size={20} icon={faArrowLeft} color="#fff" />
          </TouchableOpacity>
          <View style={styles.spacerActionWrapper} />
        </View>
        <View style={styles.spacer} />
        {/* Header container */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Daily Insight: {selectedDate}</Text>
        </View>
        <View style={styles.spacer} />
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <Text style={styles.subText}>{formattedTextSplit(details)}</Text>
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
  spacerActionWrapper: {
    flex: 1,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headerText: {
    color: '#F1F6FB',
    fontWeight: '100',
    fontSize: 30,
  },
  container: {
    flex: 1,
    backgroundColor: '#08141E',
    paddingHorizontal: 15,
  },
  spacer: {
    paddingVertical: 10,
  },
  subText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
  },
});
export default InsightDetails;
