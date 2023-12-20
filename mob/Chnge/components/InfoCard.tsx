import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

type Props = {
  pressCard?: () => void;
  title: string;
  bgColor?: string;
  data: undefined | string;
};

const InfoCard = ({pressCard, title, bgColor, data}: Props) => {
  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        {backgroundColor: bgColor},
        // eslint-disable-next-line react-native/no-inline-styles
        {opacity: !data ? 0.2 : 1},
      ]}
      disabled={!data}
      onPress={pressCard}>
      <View style={styles.content}>
        <View style={styles.cardActionsWrapper}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    backgroundColor: '#333',
    borderRadius: 5,
    padding: 12,
    height: 90,
    flex: 1,
  },
  cardActionsWrapper: {},
  cardActionsWrapperSpacer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 20,
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

export default InfoCard;
