import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import HoverTooltip from '@/components/HoverTooltip';

const InstructionsBanner = ({ instructions }: { instructions: string }) => {
  return (
    // HoverTooltip wraps the banner and shows instructions on hover
    <HoverTooltip
      tooltipStyle={styles.tooltipContainer}
      explanation={instructions}
    >
      {/* Banner Container */}
      <View style={styles.bannerContainer}>
        <Text style={styles.bannerText}>Instrucciones</Text>
      </View>
    </HoverTooltip>
  );
}

const styles = StyleSheet.create({
  tooltipContainer: {
    top: hp('8%'),
    left: 0,
    width: 450,
  },
  bannerContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#FF8C00',
  },
  bannerText: {
    color: '#FF8C00',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

export default InstructionsBanner;