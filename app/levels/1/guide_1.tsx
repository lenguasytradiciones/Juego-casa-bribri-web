import React from 'react';
import {Image} from "expo-image";
import { 
  ImageBackground, 
  StyleSheet, 
  View, 
  TouchableOpacity, 
} from 'react-native';
import BackButton from '@/app/misc/BackButton';
import { NavigationProp } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const Guide1 = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const bgImage = require('@/assets/images/guia1.png');
  
  // Navigate to level 1
  const handleNextButtonPress = () => {
    navigation.navigate('Level1');
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Background Image */}
        <ImageBackground 
          source={bgImage} 
          style={styles.bgImage}
          imageStyle={{ resizeMode: 'contain' }}
        >
        </ImageBackground>
        
        {/* Back Button */}
        <View style={styles.buttonsBackContainer}>
          <BackButton/>
        </View>
        
        {/* Next Button */}
        <View style={styles.buttonsNextContainer}>
          {/* Custom Next button that calls our custom handler */}
          <TouchableOpacity onPress={handleNextButtonPress} style={styles.button}>
            <Image
              source={require('@/assets/images/atras.png')}
              style={styles.adelante}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    justifyContent: 'center',
  },
  bgImage: {
    position: 'absolute',
    alignSelf: 'center',
    width: wp('75%'),
    height: hp('100%'),
    // top: hp('-23%'),
  },
  buttonsBackContainer: {
    bottom: hp('53%'),
    right: wp('-2%'),
    zIndex: 5,
  },
  buttonsNextContainer: {
    top: hp('50.5%'),
    left: wp('-4%'),
    zIndex: 5,
  },
  button: {
    position: 'absolute',
    bottom: 20,
    right: 10,
    zIndex: 1,
  },
  adelante: {
    width: 70,
    height: 40,
    transform: [{ rotate: '180deg' }, { translateX: 0 }, { translateY: 1 }],
    resizeMode: 'stretch',
  },
});

export default Guide1;