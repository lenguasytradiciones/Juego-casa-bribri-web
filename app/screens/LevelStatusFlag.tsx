import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { isLevelCompleted, LevelMode } from '../misc/progress';

interface LevelStatusFlagProps {
  levelId: number;  // Level ID for looking up completion status
  mode: LevelMode;  // Mode (READ or LISTEN) for fetching progress
}

const LevelStatusFlag = ({ levelId, mode }: LevelStatusFlagProps) => {
  const [levelCompleted, setLevelCompleted] = useState<boolean>(false);

  useEffect(() => {
    const fetchProgress = async () => {
      const levelStatus = await isLevelCompleted(levelId, mode);
      setLevelCompleted(levelStatus);
    };

    fetchProgress();
  }, [levelId, mode]);

  return (
    <View style={styles.container}>
      {levelCompleted ? (
        <>
          <Text style={styles.text}>Completado</Text>
        </>
      ) : (
        <Text style={styles.text}>Pendiente</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  text: {
    fontWeight: 'bold',
    fontSize: hp('2%'),
    color: '#444',
  },
});

export default LevelStatusFlag;
