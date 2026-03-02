// app/levels/1/level_1.tsx - Updated with word tracking
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import { Image } from "expo-image";
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Easing, ImageBackground, LogBox, StyleSheet, Text, TouchableOpacity, View, Platform
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../misc/BackButton';
import NextButton from '../../misc/NextButton';
import { completeLevel, LevelMode } from '../../misc/progress';
import { getResponsivePos } from '../../misc/responsivePosition';

LogBox.ignoreLogs([
    'Draggable: Support for defaultProps will be removed'
]);

// Objetos visuales (imágenes)
const visualObjects = [
    {
        id: 1,
        name: 'obj_ale',
        imageNormal: require('@/assets/images/ale_normal.png'), 
        imageSelected: require('@/assets/images/ale_sombra.png'),
        position: Platform.OS === 'web' ? { x: wp('3%'), y: hp('7%') } : getResponsivePos(6, 19),
        size: {
            normal: { width: wp('20%'), height: hp('12%') },
            selected: { width: wp('20%'), height: hp('15%') }
        },
        correctWord: 'alè'
    },
    {
        id: 2,
        name: 'obj_nolo_nkuo',
        imageNormal: require('@/assets/images/nolo_kuo_normal.png'),
        imageSelected: require('@/assets/images/nolo_kuo_sombra.png'),
        position: Platform.OS === 'web' ? { x: wp('2%'), y: hp('19%') } : getResponsivePos(4, 43),
        size: {
            normal: { width: wp('24%'), height: hp('15%') },
            selected: { width: wp('24%'), height: hp('16%') }
        },
        correctWord: 'ñolö nkuö'
    },
    {
        id: 3,
        name: 'obj_kapo',
        imageNormal: require('@/assets/images/kapo_normal.png'),
        imageSelected: require('@/assets/images/kapo_sombra.png'),
        position: Platform.OS === 'web' ? { x: wp('5%'), y: hp('33%') } : getResponsivePos(12, 65),
        size: {
            normal: { width: wp('18%'), height: hp('11%') },
            selected: { width: wp('18%'), height: hp('12%') }
        },
        correctWord: 'kapö'
    },
    {
        id: 4,
        name: 'obj_nolo_kibi',
        imageNormal: require('@/assets/images/nolo_kibi_normal.png'),
        imageSelected: require('@/assets/images/nolo_kibi_sombra.png'),
        position: Platform.OS === 'web' ? { x: wp('0%'), y: hp('57%') } : getResponsivePos(-1, 109),
        size: {
            normal: { width: wp('20%'), height: hp('12%') },
            selected: { width: wp('21%'), height: hp('14%') }
        },
        correctWord: 'ñolö kibí'
    }
];

const draggableElements = [
    {
        id: 1,
        name: 'alè',
        image: require('@/assets/images/ale.png'),
    },
    {
        id: 2,
        name: 'kapö',
        image: require('@/assets/images/kapo.png'),
    },
    {
        id: 3,
        name: 'ñolö kibí',
        image: require('@/assets/images/nolo_kibi.png'),
    },
    {
        id: 4,
        name: 'ñolö nkuö',
        image: require('@/assets/images/nolo_nkuo.png'),
    },
];

const wordColors = [
    {
        name: 'alè',
        color: '#0046e3',
    },
    {
        name: 'ñolö kibí',
        color: '#603f91',
    },
    {
        name: 'kapö',
        color: '#ede430',
    },
    {
        name: 'ñolö nkuö',
        color: '#e4191c',
    },
];

const Level1 = ({ navigation }: { navigation: NavigationProp<any> }) => {
    // Game state
    const [selectedWord, setSelectedWord] = useState<string | null>(null);
    const [selectedObject, setSelectedObject] = useState<string | null>(null);
    const [matches, setMatches] = useState<Record<string, string>>({});
    const [canContinue, setCanContinue] = useState(false);

    const LEVEL_ID = 1;
    const LEVEL_MODE = LevelMode.READ;

    const [levelCompleted, setLevelCompleted] = useState(false);

    // Animation values for visual objects
    const animatedValues = useRef(
        visualObjects.reduce((acc, obj) => {
            acc[obj.name] = new Animated.Value(1);
            return acc;
        }, {} as Record<string, Animated.Value>)
    ).current;

    // Pulse animation for visual objects
    const startPulseAnimation = (objectName: string) => {
        animatedValues[objectName].setValue(1);

        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValues[objectName], {
                    toValue: 1.1,
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true
                }),
                Animated.timing(animatedValues[objectName], {
                    toValue: 1,
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true
                })
            ])
        ).start();
    };

    const stopPulseAnimation = (objectName: string) => {
        animatedValues[objectName].stopAnimation();
        animatedValues[objectName].setValue(1);
    };

    // Game logic for word selection - UPDATED WITH TRACKING
    const handleWordPress = async (item: { name: string }) => {
        if (Object.values(matches).includes(item.name)) return;

        if (selectedObject) {
            const objectInfo = visualObjects.find(obj => obj.name === selectedObject);
            if (objectInfo && objectInfo.correctWord === item.name) {
                // CORRECT match - update matches state and clear selections                
                setMatches(prev => ({
                    ...prev,
                    [selectedObject]: item.name
                }));
                stopPulseAnimation(selectedObject);
                setSelectedObject(null);
                setSelectedWord(null);
            } else {
                setSelectedWord(selectedWord === item.name ? null : item.name);
            }
        } else {
            setSelectedWord(selectedWord === item.name ? null : item.name);
        }
    };

    // Game logic for object selection
    const handleObjectPress = async (objectName: string) => {
        if (matches[objectName]) return;
        if (selectedObject === objectName) {
            setSelectedObject(null);
            stopPulseAnimation(objectName);
            return;
        }
        if (selectedObject) {
            stopPulseAnimation(selectedObject);
        }
        setSelectedObject(objectName);
        startPulseAnimation(objectName);
        if (selectedWord) {
            const objectInfo = visualObjects.find(obj => obj.name === objectName);
            if (objectInfo && objectInfo.correctWord === selectedWord) {
                
                setMatches(prev => ({
                    ...prev,
                    [objectName]: selectedWord
                }));
                stopPulseAnimation(objectName);
                setSelectedObject(null);
                setSelectedWord(null);
            }
        }
    };

    // Check if all matches are made to enable continue button
    useEffect(() => {
        console.log('Matches:', matches);
        console.log('Visual Objects:', visualObjects);
        console.log('Level Completed:', levelCompleted);
        if (Object.keys(matches).length === visualObjects.length && !levelCompleted) {
            setCanContinue(true);
            setLevelCompleted(true);
            // Mark level as completed
            completeLevel(LEVEL_ID, LEVEL_MODE);
        }
    }, [matches, levelCompleted]);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <ImageBackground
                    source={require('../../../assets/images/guia1juego1.png')}
                    style={styles.backgroundImage}
                    // resizeMode="contain"
                    resizeMode={Platform.OS === 'web' ? 'contain' : 'stretch'}
                >
                    {/* Back Button */}
                    <View style={styles.buttonsBackContainer}>
                        <BackButton/>
                    </View>

                    {/* Next Button */}
                    {canContinue && (
                        <View style={styles.buttonsNextContainer}>
                            <NextButton navigation={navigation} nextName="LevelMapping" />
                        </View>
                    )}

                    {/* Images - Normal and Selected */}
                    {visualObjects.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={{
                                position: 'absolute',
                                left: item.position.x,
                                top: item.position.y,
                                zIndex: 5,
                            }}
                            onPress={() => handleObjectPress(item.name)}
                            disabled={!!matches[item.name]}
                        >
                            <Animated.View
                                style={{
                                    transform: [
                                        { scale: animatedValues[item.name] }
                                    ],
                                }}
                            >
                                <Image
                                    source={
                                        selectedObject === item.name || matches[item.name]
                                            ? item.imageSelected
                                            : item.imageNormal
                                    }
                                    style={{
                                        width: selectedObject === item.name || matches[item.name]
                                            ? item.size.selected.width
                                            : item.size.normal.width,
                                        height: selectedObject === item.name || matches[item.name]
                                            ? item.size.selected.height
                                            : item.size.normal.height,
                                        resizeMode: 'contain',
                                    }}
                                />
                            </Animated.View>
                        </TouchableOpacity>
                    ))}

                    {/* Buttons Container - Word Options */}
                    <View style={styles.buttonsContainer}>
                        {draggableElements.map((item) => {
                            const isMatched = Object.values(matches).includes(item.name);
                            return (
                                <View key={item.id} style={styles.buttonWrapper}>
                                    <TouchableOpacity
                                        style={[
                                            styles.button,
                                            selectedWord === item.name && styles.selectedWord,
                                            isMatched && {
                                                backgroundColor: '#ffffff',
                                                borderColor: wordColors.find(word => word.name === item.name)?.color || '#9e9e9e',
                                                borderWidth: 2,
                                            }
                                        ]}
                                        onPress={() => handleWordPress(item)}
                                        disabled={isMatched}
                                        activeOpacity={0.7}
                                    >
                                        <Image
                                            source={item.image}
                                            style={styles.wordImage}
                                        />
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </View>
                </ImageBackground>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    bgImage: {
        alignSelf: 'center',
        width: wp('70%'),
        height: hp('100%'),
    },
    buttonsBackContainer: {
        position: 'absolute',
        top: hp('-1%'),
        left: wp('-8%'),
        zIndex: 1,
    },
    buttonsNextContainer: {
        position: 'absolute',
        bottom: hp('-3%'),
        right: wp('-6%'),
        zIndex: 1,
    },
    wordsContainer: {
        position: 'absolute',
        bottom: hp('8%'),
        left: wp('5%'),
        width: wp('25%'),
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: wp('1%'),
    },
    wordButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
        padding: hp('1%'),
        width: wp('11%'),
        height: hp('5%'),
        alignItems: 'center',
        justifyContent: 'center',
    },
    wordText: {
        fontSize: hp('2.2%'),
        color: '#000',
        textAlign: 'center',
    },
    selectedWord: {
        backgroundColor: '#f0f0f0',
        borderColor: '#677',
        borderWidth: 1.5,
    },
    dropZonesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
    },
    backgroundImage: {
        alignSelf: 'center',
        width: wp('80%'),
        height: hp('100%'),
        top: hp('-2%'),
    },
    buttonsContainer: {
        position: 'absolute',
        top: hp('82%'),
        left: wp('2%'),
        width: wp('25%'),
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: wp('1%'),
        zIndex: 6,
    },
    buttonWrapper: {
        width: wp('11%'),
        height: hp('5%'),
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 6,
    },
    button: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
        padding: hp('0.5%'),
        width: wp('11%'),
        height: hp('5%'),
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 6,
    },
    buttonText: {
        fontSize: hp('2.2%'),
        color: '#000',
        textAlign: 'center',
    },
    matchedWord: {
        opacity: 0.9,
        borderWidth: 1,
    },
    wordImage: {
        width: wp('13%'),
        height: hp('8%'),
        resizeMode: 'contain',
    },
});

export default Level1;