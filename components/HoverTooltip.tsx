import React, { useState, ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle } from 'react-native';

// Interface for Props
interface HoverTooltipProps {
  children: ReactNode;      // Allows any valid React element
  explanation: string;      // The text to display
  containerStyle?: ViewStyle; // Optional custom styling for the wrapper
}

// Custom Tooltip Component. Usage: Wrap around components and specify explanation
const HoverTooltip: React.FC<HoverTooltipProps> = ({ children, explanation, containerStyle }) => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {/* Tooltip */}
      {visible && ( // pointerEvents set to none to avoid flickering
        <View style={styles.tooltipContainer} pointerEvents="none">
          <View style={styles.bubble}>
            <Text style={styles.tooltipText}>{explanation}</Text>
          </View>
        </View>
      )}

      {/* Target Component */}
      <Pressable
        onHoverIn={() => setVisible(true)}
        onHoverOut={() => setVisible(false)}
        // The 'hovered' state is automatically typed by Pressable
        // This creates a faded-out effect on the content
        style={({ hovered }) => ({
          opacity: hovered ? 0.7 : 1
        })}
      >
        {children}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative', // Context for absolute positioning
  },
  tooltipContainer: {
    position: 'absolute',
    bottom: '120%',  // Positions tooltip a bit above the content
    zIndex: 999,  // Makes sure tooltip is above other elements
    width: 225,  // Consistent width to calculate center
    alignItems: 'center',
  },
  bubble: {
    backgroundColor: '#F49D1E',
    borderWidth: 2,
    borderColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  tooltipText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default HoverTooltip;
