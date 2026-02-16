import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import { Image } from "expo-image";
import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const HomePage = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [tutorialStep, setTutorialStep] = useState(0);
  const [toucanEnabled, setToucanEnabled] = useState<boolean | null>(null);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [showIntonationModal, setShowIntonationModal] = useState(false);

  const toucanPosition = useRef(new Animated.ValueXY({ x: wp('70%'), y: hp('15%') })).current;
  const toucanScale = useRef(new Animated.Value(0)).current;
  const bubbleOpacity = useRef(new Animated.Value(0)).current;
  const buttonHighlight = useRef(new Animated.Value(0)).current;


  const handleIntonationGuide = () => {
    setShowIntonationModal(true);
  };

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

  const openLink = async (url: string) => {
    // Open the provided URL in the default browser
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
    } else {
      Alert.alert(`No se puede abrir el enlace: ${url}`);
    }
  }

  const handleManualPreview = () => {
    if (tutorialStep === 4) {
      advanceTutorial();
    }
    setShowPDFModal(true);
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

        {/* Manual Button */}
        {/* <TouchableOpacity onPress={handleManualPreview} style={styles.manualButton}>
          <Text style={styles.manualButtonText}>📖</Text>
        </TouchableOpacity> */}

        {/* Intonation Guide Button */}
        {/* <TouchableOpacity onPress={handleIntonationGuide} style={styles.intonationButton}>
          <Text style={styles.intonationButtonText}>🎵</Text>
        </TouchableOpacity> */}


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
          <TouchableOpacity onPress={handlePress} style={styles.buttonImageContainer}>
            <Image
              source={require('@/assets/images/jugar.png')}
              style={styles.buttonImage}
              resizeMode="stretch"
            />
          </TouchableOpacity>
        </View>

        {/* Intonation Guide Modal */}
        <Modal
          visible={showIntonationModal}
          animationType="slide"
          onRequestClose={() => setShowIntonationModal(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Guía de Intonaciones BriBri</Text>
              <TouchableOpacity
                onPress={() => setShowIntonationModal(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Intonation Content */}
            <ScrollView style={styles.intonationContainer} contentContainerStyle={styles.intonationContent}>
              <Text style={styles.intonationTitle}>Convenciones Ortográficas del BriBri</Text>

              <View style={styles.alphabetSection}>
                <Text style={styles.sectionTitle}>Alfabeto BriBri</Text>
                <View style={styles.alphabetContainer}>
                  <Text style={styles.alphabetText}>
                    a a̱ b ch d e ë e̱ i i̱ j k l m n ñ o ö o̱ p r s sh t tk ts u u̱ w y &apos;
                  </Text>
                </View>
              </View>

              {/* Consonants Section */}
              <View style={styles.phonemeSection}>
                <Text style={styles.sectionTitle}>Consonantes</Text>
                {[
                  { letter: 'b', ipa: '[b]', desc: 'Como la b en bola', wiki: 'Voiced_bilabial_plosive' },
                  { letter: 'ch', ipa: '[t͡ʃ]', desc: 'Como ch en chico', wiki: 'Voiceless_postalveolar_affricate' },
                  { letter: 'd', ipa: '[d]', desc: 'Como la d en dar', wiki: 'Voiced_dental_and_alveolar_plosives' },
                  { letter: 'j', ipa: '[x]', desc: 'Como la j en jabón', wiki: 'Voiceless_velar_fricative' },
                  { letter: 'k', ipa: '[k]', desc: 'Como la c en casa', wiki: 'Voiceless_velar_plosive' },
                  { letter: 'l', ipa: '[ɽ]/[ɺ]', desc: 'Sonido intermedio entre l y r', wiki: 'Retroflex_flap' },
                  { letter: 'm', ipa: '[m]', desc: 'Como la m en madre', wiki: 'Bilabial_nasal' },
                  { letter: 'n', ipa: '[n]', desc: 'Como la n en nariz', wiki: 'Dental,_alveolar_and_postalveolar_nasals' },
                  { letter: 'ñ', ipa: '[ɲ]', desc: 'Como la ñ en caña', wiki: 'Palatal_nasal' },
                  { letter: 'p', ipa: '[p]', desc: 'Como la p en pata', wiki: 'Voiceless_bilabial_plosive' },
                  { letter: 'r', ipa: '[ɾ]', desc: 'Como la r en caro', wiki: 'Dental_and_alveolar_flaps' },
                  { letter: 's', ipa: '[s]', desc: 'Como la s en sal', wiki: 'Voiceless_alveolar_fricative' },
                  { letter: 'sh', ipa: '[ʃ]', desc: 'Como sh en inglés shoe', wiki: 'Voiceless_postalveolar_fricative' },
                  { letter: 't', ipa: '[t]', desc: 'Como la t en tío', wiki: 'Voiceless_dental_and_alveolar_plosives' },
                  { letter: 'tk', ipa: '[t˺c]/[t͡ːʃ]', desc: 'Pronunciación variable según región', wiki: 'Ejective_consonant' },
                  { letter: 'ts', ipa: '[t͡s]', desc: 'Como zz en pizza italiana', wiki: 'Voiceless_alveolar_affricate' },
                  { letter: 'w', ipa: '[w]', desc: 'Como la u en huevo', wiki: 'Voiced_labio-velar_approximant' },
                  { letter: 'y', ipa: '[d͡ʒ]', desc: 'Como la y en yo', wiki: 'Voiced_postalveolar_affricate' },
                  { letter: "'", ipa: '[ʔ]', desc: 'Cierre momentáneo de cuerdas vocales', wiki: 'Glottal_stop' }
                ].map((consonant, index) => (
                  <View key={index} style={styles.phonemeRow}>
                    <Text style={styles.phonemeLetter}>{consonant.letter}</Text>
                    <TouchableOpacity
                      style={styles.ipaButton}
                      onPress={() => openLink(`https://en.wikipedia.org/wiki/${consonant.wiki}`)}
                    >
                      <Text style={styles.ipaText}>{consonant.ipa}</Text>
                    </TouchableOpacity>
                    <Text style={styles.phonemeDesc}>{consonant.desc}</Text>
                  </View>
                ))}
              </View>

              {/* Vowels Section */}
              <View style={styles.phonemeSection}>
                <Text style={styles.sectionTitle}>Vocales</Text>
                <Text style={styles.sectionNote}>
                  El BriBri tiene vocales nasales (marcadas con subrayado) y dos vocales adicionales: ë y ö
                </Text>
                {[
                  { letter: 'a', ipa: '[a]', desc: 'Como la a en español', wiki: 'Open_front_unrounded_vowel' },
                  { letter: 'a̱', ipa: '[ã]', desc: 'Como la a, pero nasal', wiki: 'Nasal_vowel' },
                  { letter: 'e', ipa: '[e]', desc: 'Como la e en español', wiki: 'Close-mid_front_unrounded_vowel' },
                  { letter: 'ë', ipa: '[ɪ]', desc: 'Sonido intermedio entre i y e', wiki: 'Near-close_near-front_unrounded_vowel' },
                  { letter: 'e̱', ipa: '[ẽ]', desc: 'Como la e, pero nasal', wiki: 'Nasal_vowel' },
                  { letter: 'i', ipa: '[i]', desc: 'Como la i en español', wiki: 'Close_front_unrounded_vowel' },
                  { letter: 'i̱', ipa: '[ĩ]', desc: 'Como la i, pero nasal', wiki: 'Nasal_vowel' },
                  { letter: 'o', ipa: '[o]', desc: 'Como la o en español', wiki: 'Close-mid_back_rounded_vowel' },
                  { letter: 'ö', ipa: '[ʊ]', desc: 'Sonido intermedio entre u y o', wiki: 'Near-close_near-back_rounded_vowel' },
                  { letter: 'o̱', ipa: '[õ]', desc: 'Como la o, pero nasal', wiki: 'Nasal_vowel' },
                  { letter: 'u', ipa: '[u]', desc: 'Como la u en español', wiki: 'Close_back_rounded_vowel' },
                  { letter: 'u̱', ipa: '[ũ]', desc: 'Como la u, pero nasal', wiki: 'Nasal_vowel' }
                ].map((vowel, index) => (
                  <View key={index} style={styles.phonemeRow}>
                    <Text style={styles.phonemeLetter}>{vowel.letter}</Text>
                    <TouchableOpacity
                      style={styles.ipaButton}
                      onPress={() => openLink(`https://en.wikipedia.org/wiki/${vowel.wiki}`)}
                    >
                      <Text style={styles.ipaText}>{vowel.ipa}</Text>
                    </TouchableOpacity>
                    <Text style={styles.phonemeDesc}>{vowel.desc}</Text>
                  </View>
                ))}
              </View>

              {/* Tones Section */}
              <View style={styles.phonemeSection}>
                <Text style={styles.sectionTitle}>Tonos</Text>
                <Text style={styles.sectionNote}>
                  El BriBri es una lengua de acento tonal. Los diacríticos marcan tanto el acento como el tipo de tono.
                </Text>
                {[
                  { mark: '´', ipa: '[´]', desc: 'Tono alto o ascendente', wiki: 'Tone_(linguistics)' },
                  { mark: '`', ipa: '[ˆ]', desc: 'Tono descendente', wiki: 'Tone_(linguistics)' },
                  { mark: 'ˆ', ipa: '[ˇ]', desc: 'Tono ascendente (dialecto Amubre)', wiki: 'Tone_(linguistics)' }
                ].map((tone, index) => (
                  <View key={index} style={styles.phonemeRow}>
                    <Text style={styles.phonemeLetter}>{tone.mark}</Text>
                    <TouchableOpacity
                      style={styles.ipaButton}
                      onPress={() => openLink(`https://en.wikipedia.org/wiki/${tone.wiki}`)}
                    >
                      <Text style={styles.ipaText}>{tone.ipa}</Text>
                    </TouchableOpacity>
                    <Text style={styles.phonemeDesc}>{tone.desc}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.footerSection}>
                <Text style={styles.footerText}>
                  Toca los símbolos IPA (entre corchetes) para aprender más sobre cada sonido en Wikipedia.
                </Text>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>

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
            <TouchableOpacity onPress={handleInstrucciones} style={styles.bottomButton}>
              <Image
                source={require('@/assets/images/instrucciones.png')}
                style={styles.buttonIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCreditos} style={styles.bottomButton}>
              <Image
                source={require('@/assets/images/creditos.png')}
                style={styles.buttonIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* PDF Preview Modal - Using local PDF with multiple fallback options */}
        <Modal
          visible={showPDFModal}
          animationType="slide"
          onRequestClose={() => setShowPDFModal(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Manual Original BriBri</Text>
              <TouchableOpacity
                onPress={() => setShowPDFModal(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* PDF Content - Try multiple approaches */}
            <ScrollView style={styles.pdfContainer} contentContainerStyle={styles.pdfContent}>
              <Text style={styles.pdfTitle}>Diccionario de la Casa Tradicional BriBri</Text>
              <Text style={styles.pdfSubtitle}>Universidad de Costa Rica</Text>

              <View style={styles.pdfInfoContainer}>
                <Text style={styles.pdfDescription}>
                  Este manual contiene el vocabulario tradicional BriBri relacionado con la casa y sus elementos.
                </Text>

                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={() => {
                    openLink('https://www.dipalicori.ucr.ac.cr/wp-content/uploads/Diccionario_casa_tradicional_bribri.pdf')
                  }}
                >
                  <Text style={styles.downloadButtonText}>Ver Manual Completo</Text>
                </TouchableOpacity>

                <View style={styles.vocabularyPreview}>
                  <Text style={styles.vocabularyTitle}>Vocabulario incluido en la app:</Text>
                  <Text style={styles.vocabularyItem}>• alè - alero</Text>
                  <Text style={styles.vocabularyItem}>• ñolö nkuö - caminito de la casa</Text>
                  <Text style={styles.vocabularyItem}>• kapö - hamaca</Text>
                  <Text style={styles.vocabularyItem}>• ñolö kibí - camino antes de la casa</Text>
                  <Text style={styles.vocabularyItem}>• tso klowok - puerta</Text>
                  <Text style={styles.vocabularyItem}>• shkéki - ventana</Text>
                  <Text style={styles.vocabularyItem}>• y muchas más...</Text>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>
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
  // Intonation Guide Styles
  intonationContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  intonationContent: {
    padding: wp('5%'),
  },
  intonationTitle: {
    fontSize: hp('3%'),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
  intonationSubtitle: {
    fontSize: hp('2%'),
    color: '#666',
    marginBottom: hp('3%'),
    textAlign: 'center',
    fontStyle: 'italic',
  },
  alphabetSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: wp('4%'),
    marginBottom: hp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp('1.5%'),
  },
  alphabetContainer: {
    backgroundColor: '#f0f8ff',
    padding: wp('3%'),
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4169E1',
  },
  alphabetText: {
    fontSize: hp('2.2%'),
    color: '#333',
    textAlign: 'center',
    lineHeight: hp('3%'),
    fontFamily: 'monospace',
  },
  phonemeSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: wp('4%'),
    marginBottom: hp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionNote: {
    fontSize: hp('1.8%'),
    color: '#666',
    marginBottom: hp('2%'),
    fontStyle: 'italic',
    textAlign: 'center',
  },
  phonemeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1%'),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  phonemeLetter: {
    fontSize: hp('2.2%'),
    fontWeight: 'bold',
    color: '#333',
    width: wp('12%'),
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  ipaButton: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.5%'),
    borderRadius: 5,
    marginHorizontal: wp('2%'),
    minWidth: wp('15%'),
  },
  ipaText: {
    fontSize: hp('2%'),
    color: '#1976d2',
    textAlign: 'center',
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  phonemeDesc: {
    fontSize: hp('1.8%'),
    color: '#555',
    flex: 1,
    paddingLeft: wp('2%'),
  },
  footerSection: {
    backgroundColor: '#fff3cd',
    padding: wp('4%'),
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    marginTop: hp('2%'),
  },
  footerText: {
    fontSize: hp('1.8%'),
    color: '#856404',
    textAlign: 'center',
    fontStyle: 'italic',
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
  intonationButton: {
    position: 'absolute',
    top: hp('5%'),
    right: wp('20%'),
    zIndex: 6,
    width: wp('12%'),
    height: hp('12%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  intonationButtonText: {
    fontSize: hp('6%'),
    color: '#4169E1',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  modalTitle: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#e74c3c',
    borderRadius: 20,
    minWidth: 40,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
  },
  pdfContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  pdfContent: {
    padding: wp('5%'),
    alignItems: 'center',
  },
  pdfTitle: {
    fontSize: hp('3%'),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
  pdfSubtitle: {
    fontSize: hp('2%'),
    color: '#666',
    marginBottom: hp('3%'),
    textAlign: 'center',
  },
  pdfInfoContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: wp('5%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pdfDescription: {
    fontSize: hp('2%'),
    color: '#555',
    textAlign: 'center',
    marginBottom: hp('3%'),
    lineHeight: hp('2.5%'),
  },
  downloadButton: {
    backgroundColor: '#3498db',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('8%'),
    borderRadius: 25,
    marginBottom: hp('3%'),
    alignSelf: 'center',
  },
  downloadButtonText: {
    color: 'white',
    fontSize: hp('2%'),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  vocabularyPreview: {
    backgroundColor: '#f0f8ff',
    padding: wp('4%'),
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  vocabularyTitle: {
    fontSize: hp('2.2%'),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp('1%'),
  },
  vocabularyItem: {
    fontSize: hp('1.8%'),
    color: '#555',
    marginBottom: hp('0.5%'),
    paddingLeft: wp('2%'),
  },
});

export default HomePage;