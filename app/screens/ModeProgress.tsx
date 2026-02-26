import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { getLevelProgress, LevelMode } from '../misc/progress';

interface ModeProgressProps {
  mode: LevelMode;  // Mode to display progress for
}

// Component that shows the amount of levels completed for a mode
const ModeProgress: React.FC<ModeProgressProps> = ({ mode }) => {
  const [completedLevels, setCompletedLevels] = useState(0);

  useEffect(() => {
      const loadProgress = async () => {
        const progress = await getLevelProgress();  // Fetch the level progress

        // Calculate the number of completed levels based on the mode
        const completed = mode === LevelMode.READ ? progress.readLevels.length : 
            progress.listenLevels.length;
        setCompletedLevels(completed);
      };
      
      loadProgress();
    }, []);

  return (
    <View style={styles.container}>
      <View style={styles.countContainer}>
        <View style={styles.flexContainer}>
          <Image
            source={mode === LevelMode.READ ? require('@/assets/images/star_read.png') : 
                require('@/assets/images/star_listen.png')}
            style={styles.progressI}
            resizeMode="contain"
          />
          <Text style={styles.starCount}>{completedLevels}/7</Text>
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
  progressI: {
    width: wp('5%'),
    height: hp('5%'),
  },
  starCount: {
    marginLeft: 5,
    fontWeight: 'bold',
    fontSize: hp('2%'),
    color: '#444',
  }
});
    

export default ModeProgress;
