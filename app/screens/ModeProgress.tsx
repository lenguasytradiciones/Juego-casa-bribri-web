import { View, Text, StyleSheet, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LevelMode } from '../misc/progress';

interface ModeProgressProps {
  mode: LevelMode;  // Mode to display progress for
  completedLevels?: number;
}

// Component that shows the amount of levels completed for a mode
const ModeProgress: React.FC<ModeProgressProps> = ({ mode, completedLevels = 0 }) => {
  return (
    <View style={styles.container}>
      <View style={styles.countContainer}>
        <View style={styles.flexContainer}>
          <Text style={styles.completedCount}>{completedLevels}/7</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  flexContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedCount: {
    marginHorizontal: 5,
    fontWeight: 'bold',
    fontSize: hp('2.5%'),
    color: '#444',
  }
});
    
export default ModeProgress;