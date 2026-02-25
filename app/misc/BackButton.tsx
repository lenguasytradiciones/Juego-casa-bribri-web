import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface BackButtonProps {
  onPress?: () => void;  // Optional: custom behavior for navigation.
}

// Defaults to returning to previous route in history if routing onPress function not passed
const BackButton: React.FC<BackButtonProps> = ({ onPress }) => {
  const navigation = useNavigation();

  // Handle back button press
  const handlePress = () => {
    if (onPress) {
      // If onPress is provided, use it
      onPress();
    } else if (navigation.canGoBack()) {
      // Otherwise go back if possible
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.button} activeOpacity={0.7}>
      <Image
        source={require('@/assets/images/atras.png')}
        style={styles.atras}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  atras: {
    width: 70,
    height: 50,
    resizeMode: 'stretch',
  },
  button: {
    position: 'absolute',
    top: 40,
    left: 30,
    zIndex: 10,
  },
});

export default BackButton;