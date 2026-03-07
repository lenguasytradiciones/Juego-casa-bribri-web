import { useState, useCallback } from 'react';
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
import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import BackButton from '../misc/BackButton';
import { LEVELS } from '../misc/constants';
import { LevelMode, LevelProgress, getLevelProgress } from '../misc/progress';
import ModeProgress from '../screens/ModeProgress';
import LevelStatusFlag from '../screens/LevelStatusFlag';
import HoverTooltip from '@/components/HoverTooltip';
import RestartModal from '../screens/RestartModal';

const LevelMapping = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [mode, setMode] = useState<string | null>(null);  // Selected mode
  const [isModeSelected, setIsModeSelected] = useState<boolean>(false);  // Flag of whether mode was selected
  const [progress, setProgress] = useState<LevelProgress | null>(null);
  const [showRestartModal, setShowRestartModal] = useState<boolean>(false);

  // Fetch mode from AsyncStorage to show correct levels
  const fetchSettings = async () => {
    try {
      const storedMode = await AsyncStorage.getItem('mode');
      const storedIsModeSelected = await AsyncStorage.getItem('isModeSelected');
      
      setMode(storedMode);
      setIsModeSelected(storedIsModeSelected === 'true');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  // Fetch progress from AsyncStorage to show correct level completion status
  const checkProgress = async () => {
    try {
      const updatedProgress = await getLevelProgress();
      setProgress(updatedProgress);

      // If all levels are completed in both modes, show restart modal
      if (updatedProgress.readLevels.length === LEVELS.length &&
         updatedProgress.listenLevels.length === LEVELS.length
      ) {
        setShowRestartModal(true);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  // Load settings and progress when screen is focused
  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        await fetchSettings();
        await checkProgress();
      };
      load();
    }, [])
  )

  // Function for handling button clicks to select mode
  const handleModeSelection = async (button: string) => {
    try {
      // Store new mode and selection status
      const newMode = button === 'listenButton' ? 'listen' : 'read';
      await AsyncStorage.setItem('mode', newMode);
      await AsyncStorage.setItem('isModeSelected', 'true');

      console.log(`${button} clicked, ${newMode} stored in AsyncStorage`);

      // Update new mode and selection status
      setMode(newMode);
      setIsModeSelected(true);
    } catch (error) {
      console.error('Failed to store mode in AsyncStorage:', error);
    }
  };

  // Function for handling back button press
  const handleBackPress = async () => {
    // If mode has been selected, deselect to return to mode selection
    if (isModeSelected) {
      try {
        await AsyncStorage.removeItem('mode');
        await AsyncStorage.setItem('isModeSelected', 'false');
        setIsModeSelected(false);
        setMode(null);
      } catch (error) {
        console.error('Error storing settings:', error);
      }
    } else {
      navigation.navigate('HomePage');  // Go back to homepage since mode has not been selected
    }
  };

  // Function for handling level button press
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

  // Function to check if a level is completed using the fetched progress
  const isLevelCompleted = (levelId: number, mode: LevelMode): boolean => {
    if (progress === null) return false; // If progress hasn't loaded yet, treat as not completed
  
    // Check if the levelID is in the appropriate list based on mode
    // If it is recorded, it has been completed.
    return mode === LevelMode.READ 
      ? progress.readLevels.includes(levelId)
      : progress.listenLevels.includes(levelId);
  };

  // Function to handle restart after all levels are completed
  const handleRestart = async () => {
    await checkProgress();
    setShowRestartModal(false);
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

          {/* Read and Listen Progress (Shown if no mode is selected) */}
          {isModeSelected ? null : (
            <View style={styles.readProgressContainer}>
              <ModeProgress mode={LevelMode.READ} completedLevels={progress?.readLevels.length}/>
            </View>
          )}

          {isModeSelected ? null : (
            <View style={styles.listenProgressContainer}>
              <ModeProgress mode={LevelMode.LISTEN} completedLevels={progress?.listenLevels.length} />
            </View>
          )}

          {/* Custom Back Button */}
          <BackButton onPress={handleBackPress} />

          <RestartModal visible={showRestartModal} onClose={handleRestart} />

          {/* Main Content */}
          <View style={styles.content}>
            {!isModeSelected ? (
              <View style={styles.buttonContainer}>
                <HoverTooltip explanation="Asociar audio con imagen" tooltipStyle={{ bottom: '75%', width: wp('30%') }}> 
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.button}
                    onPress={() => handleModeSelection('listenButton')}
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
                    onPress={() => handleModeSelection('readButton')}
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
                    <View style={styles.levelStarContainer}>
                      <LevelStatusFlag 
                        isLevelCompleted={isLevelCompleted(level.id, mode as LevelMode)}
                      />
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleLevelPress(level.id)}
                      style={styles.levelButton}
                    >
                      <Image
                        source={isModeSelected && mode === 'read' ? level.image2 : level.image}
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
  // Mode progress displays
  listenProgressContainer: {
    position: 'absolute',
    top: hp('31%'),
    left: wp('25.75%'),
  },
  readProgressContainer: {
    position: 'absolute',
    top: hp('31%'),
    right: wp('25.75%'),
  },
});

export default LevelMapping;