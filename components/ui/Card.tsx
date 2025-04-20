import React from 'react';
import { 
  StyleSheet, 
  View, 
  ViewStyle,
  Platform,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { COLORS, BORDER_RADIUS, SHADOW, SPACING } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  disabled?: boolean;
  elevation?: 'sm' | 'base' | 'md' | 'lg';
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Card({
  children,
  style,
  onPress,
  disabled = false,
  elevation = 'base',
}: CardProps) {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withTiming(0.98, { duration: 100 });
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withTiming(1, { duration: 150 });
    }
  };

  const cardStyles = [
    styles.card,
    styles[`elevation${elevation.charAt(0).toUpperCase() + elevation.slice(1)}`],
    style,
  ];

  if (onPress) {
    return (
      <AnimatedPressable
        style={[cardStyles, animatedStyle]}
        onPress={onPress}
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {children}
      </AnimatedPressable>
    );
  }

  return <View style={cardStyles}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING[3],
    marginVertical: SPACING[1],
    ...Platform.select({
      web: {
        outlineStyle: 'none',
        cursor: 'pointer',
      },
    }),
  },
  elevationSm: {
    ...SHADOW.sm,
  },
  elevationBase: {
    ...SHADOW.base,
  },
  elevationMd: {
    ...SHADOW.md,
  },
  elevationLg: {
    ...SHADOW.lg,
  },
});