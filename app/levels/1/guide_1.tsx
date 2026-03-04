import { 
  ImageBackground, 
  StyleSheet, 
  View, 
} from 'react-native';
import BackButton from '@/app/misc/BackButton';
import NextButton from '@/app/misc/NextButton';
import { READ_GUIDE_INSTRUCTIONS } from '@/app/misc/instructions'
import InstructionsBanner from '@/app/screens/InstructionsBanner';
import { NavigationProp } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const Guide1 = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const bgImage = require('@/assets/images/guia1.png');

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

        {/* Instructions Banner */}
        <View style={styles.instructionBannerContainer}>
          <InstructionsBanner instructions={READ_GUIDE_INSTRUCTIONS} />
        </View>
        
        {/* Next Button */}
        <View style={styles.buttonsNextContainer}>
          <NextButton navigation={navigation} nextName="Level1"/>
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
  instructionBannerContainer: {
    position: 'absolute',
    top: hp('10%'),
    left: wp('2%'),
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