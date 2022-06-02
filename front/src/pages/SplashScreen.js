import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
} from 'react-native';

const SplashScreen = ({navigation}) => {
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setAnimating(false);
      navigation.replace('Auth');
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>IONEL ROMANIA</Text>
      <ActivityIndicator
        animating={animating}
        color="#FFFFFF"
        size="large"
        style={styles.activityIndicator}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#11CB76',
  },
  textStyle: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});