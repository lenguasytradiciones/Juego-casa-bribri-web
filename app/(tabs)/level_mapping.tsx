import React, { useState, useEffect } from 'react';
import {Image} from "expo-image";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import BackButton from '../misc/BackButton';
import { LEVELS } from '../misc/constants';
import StarsProgress from '../screens/StarsProgress';
import LevelStar from '../screens/LevelStar';
import HoverTooltip from '@/components/HoverTooltip';

// Define LevelMode enum for mode prop
enum LevelMode {
  READ = 'read',
  LISTEN = 'listen'
}

const LevelMapping = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [buttonClicked, setButtonClicked] = useState(false);
  const [mode, setMode] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Load previously selected mode
        const storedMode = await AsyncStorage.getItem('mode');
        setMode(storedMode);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    fetchSettings();
  }, [buttonClicked]);

  const handleButtonClick = async (button: string) => {
    try {
      const newMode = button === 'button1' ? 'listen' : 'read';
      await AsyncStorage.setItem('mode', newMode);
      console.log(`${button} clicked, ${newMode} stored in AsyncStorage`);
      setMode(newMode); // Update the mode state
      setButtonClicked(true);
    } catch (error) {
      console.error('Failed to store mode in AsyncStorage:', error);
    }
  };

  const handleLevelPress = (levelId: number) => {
    if (mode === 'read') {
      switch (levelId) {
        case 1:
          navigation.navigate('Guide1');
          break;
        case 2:
          navigation.navigate('Guide2');
          break;
        case 3:
          navigation.navigate('Guide3');
          break;
        case 4:
          navigation.navigate('Guide4');
          break;
        case 5:
          navigation.navigate('Guide5');
          break;
        case 6:
          navigation.navigate('Guide6');
          break;
        case 7:
          navigation.navigate('Guide7');
          break;
        default:
          console.error('Level not found');
          break;
      }
    } else {
      switch (levelId) {
        case 1:
          navigation.navigate('Guide1Listen');
          break;
        case 2:
          navigation.navigate('Guide2Listen');
          break;
        case 3:
          navigation.navigate('Guide3Listen');
          break;
        case 4:
          navigation.navigate('Guide4Listen');
          break;
        case 5:
          navigation.navigate('Guide5Listen');
          break;
        case 6:
          navigation.navigate('Guide6Listen');
          break;
        case 7:
          navigation.navigate('Guide7Listen');
          break;
        default:
          console.error('Level not found');
          break;
      }
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Image
            source={require('@/assets/images/pantalla_nivel_modo.jpg')}
            style={styles.backgroundImage}
            resizeMode={Platform.OS === 'web' ? 'stretch' : 'stretch'}
          />

          {/* Stars Progress Display */}
          <View style={styles.starsProgressContainer}>
            <StarsProgress showSeparateTypes={true} />
          </View>

          {/* Back Button */}
          <BackButton navigation={navigation} />

          {/* Contenedor central para centrar el contenido */}
          <View style={styles.content}>
            {!buttonClicked ? (
              <View style={styles.buttonContainer}>
                <HoverTooltip explanation="Asociar audio con imagen" tooltipStyle={{ bottom: '75%' }}> 
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.button}
                    onPress={() => handleButtonClick('button1')}
                  >
                    <Image
                      source={require('@/assets/images/niveles_texto.png')}
                      style={styles.buttonImage}
                      resizeMode="stretch"
                    />
                  </TouchableOpacity>
                </HoverTooltip>

                <HoverTooltip explanation='Asociar texto con imagen' tooltipStyle={{ bottom: '75%' }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.button}
                    onPress={() => handleButtonClick('button2')}
                  >
                    <Image
                      source={require('@/assets/images/niveles_imagenes.png')}
                      style={styles.buttonImage}
                      resizeMode="stretch"
                    />
                  </TouchableOpacity>
                </HoverTooltip>
              </View>
            ) : (
              <ScrollView
                horizontal
                contentContainerStyle={styles.levelContainer}
                showsHorizontalScrollIndicator={false}
              >
                {LEVELS && LEVELS.map((level) => (
                  <View key={level.id} style={styles.levelButtonWrapper}>
                    {/* Star display above level button */}
                    <View style={styles.levelStarContainer}>
                      <LevelStar 
                        levelId={level.id} 
                        mode={mode === 'read' ? LevelMode.READ : LevelMode.LISTEN}
                        size="medium"
                        showAnimation={true}
                      />
                    </View>
                    
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleLevelPress(level.id)}
                      style={styles.levelButton}
                    >
                      <Image
                        source={buttonClicked && mode === 'read' ? level.image2 : level.image}
                        style={styles.levelImage}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
  backgroundImage: Platform.OS === 'web' ? {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  } : {
    ...StyleSheet.absoluteFillObject,
    width: wp('100%'),
    height: hp('100%'),
    // transform: [{ translateY: -hp('3%') }],
  },
  // Contenedor central que centra el contenido (botones o niveles)
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: wp('80%'),
    marginVertical: hp('2%'),
    zIndex: 5,
  },
  button: {
    marginHorizontal: wp('2%'),
    zIndex: 6,
  },
  buttonImage: {
    width: wp('20%'),
    height: hp('37%'),
  },
  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('2%'),
  },
  levelButtonWrapper: {
    alignItems: 'center',
    marginHorizontal: wp('1%'),
  },
  levelStarContainer: {
    height: hp('5%'),
    marginBottom: hp('1%'),
  },
  levelButton: {
    width: wp('10%'),
    height: hp('18%'),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 6,
  },
  levelImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  // Stars progress display
  starsProgressContainer: {
    position: 'absolute',
    top: hp('5%'),
    right: wp('5%'),
    zIndex: 10,
  },
});

export default LevelMapping;