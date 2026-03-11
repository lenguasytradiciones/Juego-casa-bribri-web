import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Image,
  Animated,
  Easing
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { resetProgress } from '../misc/progress';

interface RestartModalProps {
  visible: boolean;
  onClose: () => void;
}

const RestartModal: React.FC<RestartModalProps> = ({
  visible,
  onClose,
}) => {
  // Animation refs
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
  // Determines if animations should run when modal becomes visible
  useEffect(() => {
    if (visible) {
      startAnimations();
    } else {
      // Reset animations when modal is hidden
      scaleAnim.setValue(0.5);
      opacityAnim.setValue(0);
    }
  }, [visible]);
  
  const startAnimations = () => {
    // Create sequential animations
    Animated.sequence([
      // First fade in and scale up
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          tension: 40,
          useNativeDriver: true,
        })
      ]),
    ]).start();
  };
  
  // Handler for resetting progress and closing modal
  const handleRestart = async () => {
    await resetProgress();
    onClose();
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Animated.View 
          style={[
            styles.modalContent,
            {
              opacity: opacityAnim,
              transform: [
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          <Text style={styles.congratsText}>¡Felicidades!</Text>
          <Text style={styles.descriptionText}>Ha completado todos los niveles</Text>

          <Image
            source={require('@/assets/images/casa_sin_elementos.png')}
            style={styles.itemImage}
            resizeMode="contain"
          />
          
          <View style={styles.buttonsContainer}>        
            {(
              <TouchableOpacity 
                style={[styles.button, styles.restartButton]} 
                onPress={handleRestart}
              >
                <Text style={styles.buttonText}>Reiniciar Progreso</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: wp('50%'),
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  congratsText: {
    fontSize: hp('3.5%'),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: hp('2%'),
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemImage: {
    width: wp('20%'),
    height: hp('20%'),
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    minWidth: wp('15%'),
    alignItems: 'center',
  },
  restartButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: hp('2%'),
  }
});

export default RestartModal;