import { useState } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { Image } from "expo-image";
import {
  Alert,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import HoverTooltip from '@/components/HoverTooltip';
import AboutTheResourceModal from '../screens/AboutTheResourceModal';
import CreditsModal from '../screens/CreditsModal';

const HomePage = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [showAboutTheResourceModal, setShowAboutTheResourceModal] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  // Navigates to level mapping when play button is pressed
  const handlePress = () => {
    navigation.navigate('LevelMapping');
  };

  const handleAboutTheResource = () => {
    setShowAboutTheResourceModal(true);
  };

  const handleCreditos = () => {
    setShowCreditsModal(true);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Fondo principal */}
        <Image
          source={require('@/assets/images/pantalla_principal.png')}
          style={styles.backgroundImage}
          resizeMode={Platform.OS === 'web' ? 'stretch' : 'stretch'}
        />

        {/* Main Buttons Container */}
        <View style={styles.mainButtonsContainer}>
          {/* Botón "Jugar" */}
          <HoverTooltip explanation="Jugar" tooltipStyle={{ bottom: '80%' }}>
            <TouchableOpacity onPress={handlePress} style={styles.buttonImageContainer}>
              <Image
                source={require('@/assets/images/jugar.png')}
                style={styles.buttonImage}
                resizeMode="stretch"
              />
            </TouchableOpacity>
          </HoverTooltip>
        </View>

        <AboutTheResourceModal visible={showAboutTheResourceModal} onClose={() => setShowAboutTheResourceModal(false)} />
        <CreditsModal visible={showCreditsModal} onClose={() => setShowCreditsModal(false)} />
          
        {/* Contenedor inferior */}
        <View style={styles.bottomContainer}>
          <Image
            source={require('@/assets/images/button.png')}
            style={styles.buttonImageBottom}
            resizeMode="stretch"
          />
          {/* Contenedor interno para centrar los botones */}
          <View style={styles.bottomButtonsContainer}>
            {/* Botón de "Acerca de este Recurso"s*/}
            <HoverTooltip explanation='Acerca de este Recurso'>
              <TouchableOpacity onPress={handleAboutTheResource} style={styles.bottomButton}>
                <Image
                  source={require('@/assets/images/instrucciones.png')}
                  style={styles.buttonIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </HoverTooltip>
            {/* Botón de Créditos */}
            <HoverTooltip explanation='Créditos'>
              <TouchableOpacity onPress={handleCreditos} style={styles.bottomButton}>
                <Image
                  source={require('@/assets/images/creditos.png')}
                  style={styles.buttonIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </HoverTooltip>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backgroundImage: Platform.OS === 'web' ? {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  } : {
    width: wp('100%'),
    height: hp('100%'),
    transform: [{ translateY: -hp('3%') }],
  },
  mainButtonsContainer: {
    position: 'absolute',
    top: hp('30%'),
    left: wp('0.7%'),
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 5,
  },
  buttonImageContainer: {
    zIndex: 6,
  },
  buttonImage: {
    width: wp('27%'),
    height: hp('37%'),
  },
  // Manual button styles
  manualButton: {
    position: 'absolute',
    top: hp('5%'),
    right: wp('5%'),
    zIndex: 6,
    width: wp('12%'),
    height: hp('12%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  manualButtonText: {
    fontSize: hp('6%'),
    color: '#8B4513',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: wp('-2%'),
    right: hp('5%'),
    width: wp('20%'),
    height: hp('30%'),
    zIndex: 5,
  },
  buttonImageBottom: {
    width: '100%',
    height: '100%',
  },
  bottomButtonsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomButton: {
    marginHorizontal: wp('0.1%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    width: wp('7%'),
    height: hp('7%'),
  },
});

export default HomePage;