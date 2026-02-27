import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { isLevelCompleted, LevelMode } from '../misc/progress';

interface LevelStatusFlagProps {
  levelId: number;  // Level ID for looking up completion status
  mode: LevelMode;  // Mode (READ or LISTEN) for fetching progress
}

const LevelStatusFlag = ({ levelId, mode }: LevelStatusFlagProps) => {
  const [levelCompleted, setLevelCompleted] = useState<boolean | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;  // Used in case the component is unmounted before obtaining levelStatus

      const fetchProgress = async () => {
        const levelStatus = await isLevelCompleted(levelId, mode);
        if (isActive) {
          setLevelCompleted(levelStatus);
        }
      };

      fetchProgress();

      return () => {
        isActive = false; // Cleanup when the screen loses focus
      };
    }, [levelId, mode])
  );

  // Return a nothing until we know the status
  if (levelCompleted === null) return null;

  return (
    <View style={[styles.badge, levelCompleted ? styles.completedBadge : styles.pendingBadge]}>
      <Text style={[styles.text, levelCompleted ? styles.completedText : styles.pendingText]}>
        {levelCompleted ? 'Completado' : 'Pendiente'}
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
