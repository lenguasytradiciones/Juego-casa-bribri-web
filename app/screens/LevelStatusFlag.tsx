import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface LevelStatusFlagProps {
  isLevelCompleted: boolean;
}

const LevelStatusFlag = ({ isLevelCompleted}: LevelStatusFlagProps) => {
  return (
    <View style={[styles.badge, isLevelCompleted ? styles.completedBadge : styles.pendingBadge]}>
      <Text style={[styles.text, isLevelCompleted ? styles.completedText : styles.pendingText]}>
        {isLevelCompleted ? 'Completado' : 'Pendiente'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
    borderRadius: 20,
    alignSelf: 'flex-start', // Keeps the badge from stretching full width
    borderWidth: 1,
  },
  text: {
    fontWeight: '700',
    fontSize: hp('1.8%'),
    letterSpacing: 0.5,
  },
  // Completed Styles (Soft Green)
  completedBadge: {
    backgroundColor: '#E8F5E9',
    borderColor: '#A5D6A7',
  },
  completedText: {
    color: '#2E7D32',
  },
  // Pending Styles (Soft Gray)
  pendingBadge: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
  },
  pendingText: {
    color: '#757575',
  },
});

export default LevelStatusFlag;
