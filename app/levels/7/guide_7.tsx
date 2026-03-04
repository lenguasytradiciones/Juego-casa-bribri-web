import { ImageBackground, Platform, StyleSheet, View } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import BackButton from '@/app/misc/BackButton';
import NextButton from '@/app/misc/NextButton';
import { READ_GUIDE_INSTRUCTIONS } from '@/app/misc/instructions'
import InstructionsBanner from '@/app/screens/InstructionsBanner';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const Guide = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const bgImage = require('@/assets/images/guia7.png');

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Background Image */}
        <ImageBackground
          source={bgImage}
          style={styles.bgImage}
          imageStyle={{ resizeMode: 'contain' }}>
        </ImageBackground>
        
        {/* Back Button */}
        <View style={styles.buttonsBackContainer}>
          <BackButton/>
        </View>

        {/* Instructions Banner */}
        <View style={styles.instructionBannerContainer}>
          <InstructionsBanner instructions={READ_GUIDE_INSTRUCTIONS} />
        </View>

        {/* Next Button */}
        <View style={styles.buttonsNextContainer}>
          <NextButton navigation={navigation} nextName="Level7" />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles: { [key: string]: any } = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffff',
  },
  bgImage: {
    flex: 1,
    width: wp('80%'),
    height: hp('90%'),
  },
  buttonsBackContainer: {
    position: 'absolute',
    top: hp('-2%'),
    left: wp('2%'),
    resizeMode: 'cover',
  },
  instructionBannerContainer: {
    position: 'absolute',
    top: hp('11%'),
    left: wp('2%'),
    zIndex: 5,
  },
  buttonsNextContainer: {
    position: 'absolute',
    bottom: hp('0%'),
    right: wp('2%'),
  }
});

export default Guide;
