import {Image, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationProp} from '@react-navigation/native';
import OnboardFlow from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';
import {VIEWS} from '../constants/views';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Onboarding = ({navigation}: RouterProps) => {
  useEffect(() => {
    const onboarded = async () => {
      await AsyncStorage.setItem('ONBOARDED', 'true');
    };

    onboarded();
  }, []);

  return (
    <OnboardFlow
      pages={[
        {
          title: 'Welcome to Chnge: Where Finance Gets Fun',
          image: (
            <Image
              style={styles.img}
              source={require('../src/assets/icon.png')}
            />
          ),
          backgroundColor: '#08141E',
          subtitle:
            'Dive into a world where AI brings fun and insight to your financial decisions!',
        },
        {
          title: 'Personalized Alerts: Your Financial Buddy',
          image: (
            <LottieView
              source={require('../src/assets/animations/notification.json')}
              autoPlay
              loop
              style={styles.lottieStyles}
            />
          ),
          backgroundColor: '#08141E',
          subtitle:
            'Personalized alerts that make managing money a delightful experience. Helping make you aware of anything to take note of along the way.',
        },
        {
          title: 'Spend Smart, Track Smarter',
          image: (
            <LottieView
              source={require('../src/assets/animations/tracking.json')}
              autoPlay
              loop
              style={styles.lottieStyles}
            />
          ),
          backgroundColor: '#08141E',
          subtitle:
            'Logging expenses? A breeze! Watch how Chnge turns numbers into narratives for you.',
        },
        {
          title: 'Mood and Money: A Colorful Connection',
          image: (
            <LottieView
              source={require('../src/assets/animations/emotions.json')}
              autoPlay
              style={styles.lottieStyles}
            />
          ),
          backgroundColor: '#08141E',
          subtitle:
            'Discover the colorful interplay of emotions and spending. It’s enlightening and fun!',
        },
        {
          title: 'Wake Up to New Goals: Daily Financial Adventures',
          image: (
            <LottieView
              source={require('../src/assets/animations/goals.json')}
              autoPlay
              style={styles.lottieStyles}
            />
          ),
          backgroundColor: '#08141E',
          subtitle:
            'Each morning, Chnge crafts new goals from yesterday’s insights - a fresh start daily!',
        },
        {
          title: 'Insights Galore: Your Habit Detective',
          image: (
            <LottieView
              source={require('../src/assets/animations/insights.json')}
              autoPlay
              style={styles.lottieStyles}
            />
          ),
          backgroundColor: '#08141E',
          subtitle:
            "Chnge analyzes yesterday to reveal today's insights, unearthing your financial habits from previous days as you add transactions.",
        },
        {
          title: 'Begin a Joyful Financial Journey with Chnge',
          image: (
            <LottieView
              source={require('../src/assets/animations/management.json')}
              autoPlay
              style={styles.lottieStyles}
            />
          ),
          backgroundColor: '#08141E',
          subtitle:
            'Ready for fun-filled finance? Let Chnge guide your path to smart and playful money management.',
        },
      ]}
      titleStyles={styles.titleStyles}
      subTitleStyles={styles.subTitleStyles}
      containerStyles={styles.container}
      bottomBarColor="#08141E"
      style={styles.container}
      showSkip={false}
      onDone={() => navigation.navigate(VIEWS.LOGIN)}
    />
  );
};

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#168EE5',
  },
  container: {
    backgroundColor: '#08141E',
  },
  img: {width: 100, height: 100},
  titleStyles: {
    color: '#fff',
    fontWeight: '300',
  },
  subTitleStyles: {
    color: '#fff',
    fontWeight: '300',
  },
  lottieStyles: {
    width: 300,
    height: 300,
  },
});

export default Onboarding;
