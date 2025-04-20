import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { COLORS, FONTS, FONT_SIZES, BORDER_RADIUS, SPACING } from '@/constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  style,
  textStyle,
}: ButtonProps) {
  const buttonStyles: ViewStyle[] = [
    styles.base,
    styles[variant],
    styles[`${size}Size`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style as ViewStyle,
  ];

  const textStyles: TextStyle[] = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    textStyle as TextStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' || variant === 'ghost' ? COLORS.primary[500] : COLORS.white} 
          size="small" 
        />
      ) : (
        <>
          {icon && icon}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING[1.5],
    paddingHorizontal: SPACING[3],
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
      },
      android: {
        elevation: 2,
      },
      web: {
        outlineStyle: 'none',
        cursor: 'pointer',
      },
    }),
  },
  text: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.base,
    marginLeft: 8,
  },
  // Variants
  primary: {
    backgroundColor: COLORS.primary[500],
  },
  secondary: {
    backgroundColor: COLORS.secondary[500],
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary[500],
  },
  ghost: {
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  danger: {
    backgroundColor: COLORS.error[500],
  },
  // Text Variants
  primaryText: {
    color: COLORS.white,
  },
  secondaryText: {
    color: COLORS.white,
  },
  outlineText: {
    color: COLORS.primary[500],
  },
  ghostText: {
    color: COLORS.primary[500],
  },
  dangerText: {
    color: COLORS.white,
  },
  // Sizes
  smSize: {
    paddingVertical: SPACING[1],
    paddingHorizontal: SPACING[2],
  },
  mdSize: {
    paddingVertical: SPACING[1.5],
    paddingHorizontal: SPACING[3],
  },
  lgSize: {
    paddingVertical: SPACING[2],
    paddingHorizontal: SPACING[4],
  },
  // Text Sizes
  smText: {
    fontSize: FONT_SIZES.sm,
  },
  mdText: {
    fontSize: FONT_SIZES.base,
  },
  lgText: {
    fontSize: FONT_SIZES.lg,
  },
  // Other
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
});