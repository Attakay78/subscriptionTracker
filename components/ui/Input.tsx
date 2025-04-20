import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { COLORS, FONTS, FONT_SIZES, BORDER_RADIUS, SPACING } from '@/constants/theme';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  helper?: string;
  disabled?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
  icon?: React.ReactNode;
  multiline?: boolean;
  numberOfLines?: number;
  autoFocus?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
}

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  autoCapitalize = 'none',
  error,
  helper,
  disabled = false,
  style,
  inputStyle,
  keyboardType = 'default',
  icon,
  multiline = false,
  numberOfLines = 1,
  autoFocus = false,
  onBlur,
  onFocus,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hidePassword, setHidePassword] = useState(secureTextEntry);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
  };

  const containerStyle: ViewStyle[] = [
    styles.container,
    isFocused && styles.focused,
    error ? styles.error : null,
    disabled && styles.disabled,
    style as ViewStyle,
  ];

  const textInputStyle: TextStyle[] = [
    styles.input,
    icon && styles.inputWithIcon,
    inputStyle as TextStyle,
  ];

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={containerStyle}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          style={textInputStyle}
          placeholder={placeholder}
          placeholderTextColor={COLORS.neutral[400]}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={hidePassword}
          autoCapitalize={autoCapitalize}
          editable={!disabled}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoFocus={autoFocus}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={togglePasswordVisibility}
            activeOpacity={0.7}
          >
            {hidePassword ? (
              <EyeOff size={20} color={COLORS.neutral[500]} />
            ) : (
              <Eye size={20} color={COLORS.neutral[500]} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {helper && !error && <Text style={styles.helperText}>{helper}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING[2],
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.white,
    padding: SPACING[1],
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  focused: {
    borderColor: COLORS.primary[500],
  },
  error: {
    borderColor: COLORS.error[500],
  },
  disabled: {
    backgroundColor: COLORS.neutral[100],
    borderColor: COLORS.neutral[300],
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: COLORS.neutral[700],
    marginBottom: SPACING[1],
  },
  input: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.base,
    color: COLORS.neutral[900],
    paddingVertical: SPACING[1.5],
    paddingHorizontal: SPACING[1.5],
  },
  inputWithIcon: {
    paddingLeft: SPACING[0.5],
  },
  iconContainer: {
    paddingLeft: SPACING[1.5],
  },
  toggleButton: {
    padding: SPACING[1.5],
  },
  errorText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.error[500],
    marginTop: SPACING[0.5],
  },
  helperText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.neutral[500],
    marginTop: SPACING[0.5],
  },
});