import React from 'react';
import { TouchableOpacity, View, Image, Text, StyleSheet } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface NextButtonProps {
    navigation: NavigationProp<any>;
    nextName: string;
    showLabel?: boolean;
}

const NextButton: React.FC<NextButtonProps> = ({ navigation, nextName, showLabel = false }) => {
    const handleContinue = () => {
        navigation.navigate(nextName);
    }

    return (
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Image
                source={require('@/assets/images/atras.png')}
                style={styles.adelante}
            />
            {showLabel && (
                <View style={styles.buttonLabelContainer}>
                    <Text style={styles.buttonLabel}>Continuar</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    adelante: {
        width: 80,
        height: 50,
        transform: [{ rotate: '180deg' }, { translateX: 0 }, { translateY: 1 }],
        resizeMode: 'stretch',
    },
    button: {
        position: 'absolute',
        bottom: 20,
        right: 10,
        zIndex: 1,
    },
    buttonLabelContainer: {
        position: 'absolute',
        right: 80,
        top: 1,
    },
    buttonLabel: {
        color: '#FF8C00',
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default NextButton;
