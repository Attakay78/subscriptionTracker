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
import { COLORS, BORDER_RADIUS, SPACING } from '@/constants/theme';

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
        <View style={styles.innerBorder}>
          <View style={styles.glassEffect}>
            <View style={styles.content}>
              {children}
            </View>
          </View>
        </View>
      </AnimatedPressable>
    );
  }

  return (
    <View style={cardStyles}>
      <View style={styles.innerBorder}>
        <View style={styles.glassEffect}>
          <View style={styles.content}>
            {children}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.neutral[50],
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    overflow: 'hidden',
    marginVertical: SPACING[1],
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
      web: {
        outlineStyle: 'none',
        cursor: 'pointer',
      },
    }),
  },
  innerBorder: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg - 1,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    backgroundColor: COLORS.neutral[100],
  },
  glassEffect: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg - 2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    backdropFilter: 'blur(12px)',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  content: {
    padding: SPACING[3],
  },
  elevationSm: {
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  elevationBase: {
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  elevationMd: {
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  elevationLg: {
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.24,
        shadowRadius: 24,
      },
      android: {
        elevation: 16,
      },
    }),
  },
});