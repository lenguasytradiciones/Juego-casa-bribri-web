import BackButton from '@/app/misc/BackButton';
import NextButton from '@/app/misc/NextButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import { Audio } from 'expo-av';
import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const GuideListen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const bgImage = require('@/assets/images/guia1.png');

  const [mode, setMode] = useState<'read' | 'listen' | null>(null);

  useEffect(() => {
    const fetchMode = async () => {
      const storedMode = await AsyncStorage.getItem('mode');
      setMode(storedMode === 'read' || storedMode === 'listen' ? storedMode : 'listen');
    };
    fetchMode();
  }, []);

  // Draggable elements are used here only to retrieve the audio files.
  const draggableElements = [
    {
      id: 1,
      name: 'nolo_nkuo',
      audio: require('@/assets/audios/nolo_nkuo_caminito_de_la_casa.wav'),
    },
    {
      id: 2,
      name: 'nolo_kibi',
      audio: require('@/assets/audios/nolo_kibi_camino_antes_de_la_casa.wav'),
    },
    {
      id: 3,
      name: 'ale',
      audio: require('@/assets/audios/ale_alero.wav'),
    },
    {
      id: 4,
      name: 'kapo',
      audio: require('@/assets/audios/kapo_hamaca.wav'),
    },
  ];

  // Audio boxes positioned similarly to the visual objects in level_1.tsx
  const audioBoxesData = [
    {
      id: 1,
      name: 'obj_ale',
      style: {
        position: 'absolute' as 'absolute',
        left: wp('14%'),
        top: hp('28%'),
        width: wp('5%'),
        height: hp('6%'),
        borderWidth: 3,
        borderColor: 'red',
        backgroundColor: 'rgba(255, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      audioName: 'ale'
    },
    {
      id: 2,
      name: 'obj_nolo_nkuo',
      style: {
        position: 'absolute' as 'absolute',
        left: wp('7%'),
        top: hp('88%'),
        width: wp('5%'),
        height: hp('6%'),
        borderWidth: 3,
        borderColor: 'yellow',
        backgroundColor: 'rgba(255, 255, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      audioName: 'nolo_nkuo'
    },
    {
      id: 3,
      name: 'obj_kapo',
      style: {
        position: 'absolute' as 'absolute',
        left: wp('49%'),
        top: hp('78%'),
        width: wp('5%'),
        height: hp('6%'),
        borderWidth: 3,
        borderColor: 'orange',
        backgroundColor: 'rgba(255, 165, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      audioName: 'kapo'
    },
    {
      id: 4,
      name: 'obj_nolo_kibi',
      style: {
        position: 'absolute' as 'absolute',
        left: wp('35%'),
        top: hp('88%'),
        width: wp('5%'),
        height: hp('6%'),
        borderWidth: 3,
        borderColor: 'green',
        backgroundColor: 'rgba(0, 255, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      audioName: 'nolo_kibi'
    }
  ];

  // Function to play audio
  const playSound = async (audioName: string) => {
    const element = draggableElements.find(e => e.name === audioName);
    if (!element) return;

    try {
      const { sound } = await Audio.Sound.createAsync(element.audio);

      await sound.playAsync();

      // Clean up sound object after playback
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error('Error playing sound', error);
    }
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={bgImage}
          style={styles.bgImage}
          imageStyle={{ resizeMode: 'contain' }}
        >
          {/* Audio boxes overlay on the background */}
          {audioBoxesData.map((box) => (
            <TouchableOpacity
              key={box.id}
              style={box.style}
              onPress={() => playSound(box.audioName)}
            >
              <Image source={require('@/assets/images/audio.png')} style={styles.audioIcon} />
            </TouchableOpacity>
          ))}
        </ImageBackground>

        <View style={styles.buttonsBackContainer}>
          <BackButton navigation={navigation} />
        </View>

        <View style={styles.buttonsNextContainer}>
          <NextButton navigation={navigation} nextName="Level1Listen" />
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
    zIndex: -1,
    position: 'absolute',
    alignSelf: 'center',
    width: wp('75%'),
    height: hp('100%'),
    // top: hp('-23%'),
  },
  audioIcon: {
    width: wp('10%'),
    height: hp('3%'),
    resizeMode: 'contain',
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
});

export default GuideListen;