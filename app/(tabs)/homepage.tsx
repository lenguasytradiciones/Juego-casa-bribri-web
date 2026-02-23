import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import { Image } from "expo-image";
import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import HoverTooltip from '@/components/HoverTooltip';

const HomePage = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [tutorialStep, setTutorialStep] = useState(0);
  const [toucanEnabled, setToucanEnabled] = useState<boolean | null>(null);

  const toucanPosition = useRef(new Animated.ValueXY({ x: wp('70%'), y: hp('15%') })).current;
  const toucanScale = useRef(new Animated.Value(0)).current;
  const bubbleOpacity = useRef(new Animated.Value(0)).current;
  const buttonHighlight = useRef(new Animated.Value(0)).current;


  // Use useFocusEffect to check settings every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const checkToucanSettings = async () => {
        try {
          const value = await AsyncStorage.getItem('toucanGuideEnabled');
          const enabled = value !== 'false';
          const wasEnabled = toucanEnabled;

          setToucanEnabled(enabled);

          console.log('Toucan enabled:', enabled);
          console.log('Was enabled:', wasEnabled);

          // Only start tutorial if:
          // 1. Toucan is enabled
          // 2. Tutorial is not already running (tutorialStep === 0)
          // 3. Either this is the first load (wasEnabled === null) or toucan was just enabled or re-enabled
          if (enabled && tutorialStep === 0 && (wasEnabled === null || wasEnabled === false)) {
            console.log('Starting tutorial');
            startTutorial();
          }

          // If toucan was disabled, reset tutorial step
          if (!enabled && tutorialStep > 0) {
            setTutorialStep(0);
            // Reset animations
            bubbleOpacity.setValue(0);
            buttonHighlight.setValue(0);
            toucanScale.setValue(0);
          }
        } catch (error) {
          console.error('Error checking tutorial status:', error);
        }
      };

      checkToucanSettings();
    }, [tutorialStep, toucanEnabled])
  );

  const startTutorial = () => {
    // Reset all animations first
    toucanScale.setValue(0);
    bubbleOpacity.setValue(0);
    buttonHighlight.setValue(0);

    // Animate toucan entering the screen
    Animated.sequence([
      Animated.timing(toucanScale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.elastic(1.2),
      }),
      Animated.delay(500),
      Animated.timing(bubbleOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Proceed to tutorial step 1 after intro animation
      setTutorialStep(1);
    });
  };

  const advanceTutorial = () => {
    console.log('Advancing tutorial step:', tutorialStep);
    // Reset animations
    bubbleOpacity.setValue(0);
    buttonHighlight.setValue(0);

    // Move to next step
    const nextStep = tutorialStep + 1;
    setTutorialStep(nextStep);

    // Different animations based on tutorial step
    switch (nextStep) {
      case 0:
      case 1:
      case 2: // Point to "Jugar" button
        Animated.parallel([
          Animated.timing(toucanPosition, {
            toValue: { x: wp('35%'), y: hp('30%') },
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(bubbleOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
            delay: 800,
          }),
          Animated.loop(
            Animated.sequence([
              Animated.timing(buttonHighlight, {
                toValue: 1,
                duration: 800,
                useNativeDriver: false,
              }),
              Animated.timing(buttonHighlight, {
                toValue: 0.2,
                duration: 800,
                useNativeDriver: false,
              }),
            ]),
            { iterations: 3 }
          ),
        ]).start();
        break;
      case 3: // Point to settings button
        Animated.parallel([
          Animated.timing(toucanPosition, {
            toValue: { x: wp('60%'), y: hp('65%') },
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(bubbleOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
            delay: 800,
          }),
          Animated.loop(
            Animated.sequence([
              Animated.timing(buttonHighlight, {
                toValue: 1,
                duration: 800,
                useNativeDriver: false,
              }),
              Animated.timing(buttonHighlight, {
                toValue: 0.2,
                duration: 800,
                useNativeDriver: false,
              }),
            ]),
            { iterations: 3 }
          ),
        ]).start();
        break;
      case 4: // Point to instructions/credits/manual
        Animated.parallel([
          Animated.timing(toucanPosition, {
            toValue: { x: wp('50%'), y: hp('70%') },
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(bubbleOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
            delay: 800,
          }),
        ]).start();
        break;
      case 5: // Final position and message
        Animated.parallel([
          Animated.timing(toucanPosition, {
            toValue: { x: wp('70%'), y: hp('15%') },
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(bubbleOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
            delay: 800,
          }),
        ]).start();
        break;
      default: // Tutorial reset
        setTutorialStep(0);
        break;
    }
  };

  const handlePress = () => {
    if (tutorialStep === 2) {
      advanceTutorial();
    }
    navigation.navigate('LevelMapping');
  };

  const handleSettings = () => {
    if (tutorialStep === 3) {
      advanceTutorial();
    }
    navigation.navigate('ToucanSettings');
  };

  const handleInstrucciones = () => {
    if (tutorialStep === 4) {
      advanceTutorial();
    }
    // Show instructions alert or navigate to instructions screen
    Alert.alert(
      'Instrucciones',
      'Selecciona un modo de aprendizaje, luego elige un nivel. Empareja las palabras con las imágenes correctas para completar cada nivel.',
      [{ text: 'Entendido', style: 'default' }]
    );
  };

  const handleCreditos = () => {
    if (tutorialStep === 5) {
      advanceTutorial();
    }
    // Show credits alert or navigate to credits screen
    Alert.alert(
      'Créditos',
      'Desarrollado para el aprendizaje de la lengua BriBri.\n\nBasado en el Diccionario de la Casa Tradicional BriBri de la Universidad de Costa Rica.',
      [{ text: 'Cerrar', style: 'default' }]
    );
  };

  const handleToucanPress = () => {
    if (tutorialStep === 0) {
      // Start the tutorial from the beginning
      startTutorial();
    } else if (tutorialStep > 5) {
      // Reset tutorial after completion
      setTutorialStep(0);
      toucanScale.setValue(0);
      bubbleOpacity.setValue(0);
      buttonHighlight.setValue(0);
    } else {
      // Advance to next step
      advanceTutorial();
    }
  };

  // Get tutorial message based on current step
  const getTutorialMessage = () => {
    switch (tutorialStep) {
      case 1:
        return '¡Hola! Soy Tuki el Colibrí. ¡Voy a enseñarte cómo usar la aplicación para aprender BriBri!';
      case 2:
        return 'Presiona el botón "Jugar" para comenzar a aprender BriBri con diversos niveles interactivos.';
      case 3:
        return 'Si quieres activar o desactivar mi ayuda, puedes tocar mi imagen aquí abajo a la derecha.';
      case 4:
        return 'Aquí abajo encontrarás las instrucciones del juego, los créditos y el manual original de BriBri.';
      case 5:
        return '¡Estaré aquí para ayudarte durante tu aprendizaje! Tócame si necesitas ayuda. ¡Vamos a aprender BriBri juntos!';
      default:
        return '';
    }
  };

  // Calculate highlight style
  const playButtonHighlight = buttonHighlight.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,0,0)', 'rgba(255,255,0,0.5)']
  });

  const practiceButtonHighlight = buttonHighlight.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,0,0)', 'rgba(255,255,0,0.5)']
  });

  const settingsButtonHighlight = buttonHighlight.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,0,0)', 'rgba(255,255,0,0.5)']
  });

  const bottomButtonsHighlight = buttonHighlight.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,0,0)', 'rgba(255,255,0,0.3)']
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Fondo principal */}
        <Image
          source={require('@/assets/images/pantalla_principal.png')}
          style={styles.backgroundImage}
          resizeMode={Platform.OS === 'web' ? 'stretch' : 'stretch'}
        />

        {/* Toucan Guide with animated position */}
        {(toucanEnabled === true) && (
          <Animated.View
            style={[
              styles.toucanContainer,
              {
                transform: [
                  { translateX: toucanPosition.x },
                  { translateY: toucanPosition.y },
                  { scale: toucanScale }
                ]
              }
            ]}
          >
            <Animated.View style={[
              styles.speechBubble,
              { opacity: bubbleOpacity }
            ]}>
              <Text style={styles.speechText}>{getTutorialMessage()}</Text>
              {tutorialStep > 0 && tutorialStep < 7 && (
                <Text style={styles.tapToContinue}>Tócame para continuar</Text>
              )}
            </Animated.View>

            <TouchableOpacity
              onPress={handleToucanPress}
              activeOpacity={0.7}
            >
              <Image
                source={require('@/assets/images/toucan_happy.gif')}
                style={styles.toucanImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Main Buttons Container */}
        <View style={styles.mainButtonsContainer}>
          {/* Animated highlight for "Jugar" button during tutorial */}
          {tutorialStep === 2 && (
            <Animated.View
              style={[
                styles.playButtonHighlight,
                { backgroundColor: playButtonHighlight }
              ]}
            />
          )}

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

        {/* Highlight for bottom buttons during tutorial */}
        {tutorialStep === 5 && (
          <Animated.View
            style={[
              styles.bottomButtonsHighlight,
              { backgroundColor: bottomButtonsHighlight }
            ]}
          />
        )}

        {/* Contenedor inferior */}
        <View style={styles.bottomContainer}>
          {/* Settings Button with Toucan Icon */}
          <TouchableOpacity onPress={handleSettings} style={styles.settingsButton}>
            {/* Settings button highlight during tutorial */}
            {tutorialStep === 4 && (
              <Animated.View
                style={[
                  styles.settingsButtonHighlight,
                  { backgroundColor: settingsButtonHighlight }
                ]}
              />
            )}
            <Image
              source={require('@/assets/images/toucan_idle.png')}
              style={styles.settingsIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Image
            source={require('@/assets/images/button.png')}
            style={styles.buttonImageBottom}
            resizeMode="stretch"
          />
          {/* Contenedor interno para centrar los botones */}
          <View style={styles.bottomButtonsContainer}>
            {/* Botón de Instrucciones (Proximamente Informacion)*/}
            <HoverTooltip explanation='Instrucciones'>
              <TouchableOpacity onPress={handleInstrucciones} style={styles.bottomButton}>
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
  // Settings Button Styles
  settingsButton: {
    position: 'absolute',
    top: -wp('1%'),
    left: -wp('5%'),
    zIndex: 7,
    width: wp('12%'),
    height: hp('12%'),
  },
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
  settingsIcon: {
    width: '100%',
    height: '100%',
  },
  settingsButtonHighlight: {
    position: 'absolute',
    top: -wp('1%'),
    left: -wp('1%'),
    width: wp('14%'),
    height: hp('14%'),
    borderRadius: wp('7%'),
    zIndex: 5,
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
  // Styles for Toucan Guide
  toucanContainer: {
    position: 'absolute',
    zIndex: 10,
  },
  toucanImage: {
    width: wp('30%'),
    height: hp('25%'),
  },
  speechBubble: {
    position: 'absolute',
    top: -hp('12%'),
    right: wp('5%'),
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    borderWidth: 2,
    borderColor: '#FFD700',
    width: wp('38%'),
    minHeight: hp('10%'),
    zIndex: 11,
  },
  speechText: {
    fontSize: hp('1.8%'),
    color: '#333',
    textAlign: 'center',
  },
  tapToContinue: {
    fontSize: hp('1.5%'),
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
    fontStyle: 'italic',
  },
  playButtonHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: wp('27%'),
    height: hp('37%'),
    borderRadius: 15,
    zIndex: 4,
  },
  bottomButtonsHighlight: {
    position: 'absolute',
    bottom: wp('-2%'),
    right: hp('5%'),
    width: wp('20%'),
    height: hp('30%'),
    borderRadius: 15,
    zIndex: 4,
  },
});

export default HomePage;