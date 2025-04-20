import { Platform } from 'react-native';

export const COLORS = {
  primary: {
    50: '#EBF5FF',
    100: '#D6EBFF',
    200: '#ADD6FF',
    300: '#84BCFF',
    400: '#5A9DFF',
    500: '#3B82F6', // Primary
    600: '#2A6BE0',
    700: '#1D56C5',
    800: '#0F3D8C',
    900: '#0A2657',
  },
  secondary: {
    50: '#EDFCF9',
    100: '#D6F7F0',
    200: '#ADEEE0',
    300: '#84E1D0',
    400: '#5ACFC0',
    500: '#14B8A6', // Secondary
    600: '#0E9889',
    700: '#097568',
    800: '#05524A',
    900: '#02312C',
  },
  accent: {
    50: '#FFF8EB',
    100: '#FFECD1',
    200: '#FFD9A3',
    300: '#FFC175',
    400: '#FFA247',
    500: '#F97316', // Accent
    600: '#E55D11',
    700: '#BF4909',
    800: '#8C3006',
    900: '#591E04',
  },
  success: {
    50: '#EDFDF5',
    100: '#D3F8E2',
    200: '#A7F0C5',
    300: '#7BE7A8',
    400: '#4FDB8B',
    500: '#22C55E', // Success
    600: '#1A9E4B',
    700: '#137539',
    800: '#0C4F27',
    900: '#062916',
  },
  warning: {
    50: '#FEFBEA',
    100: '#FEF6D1',
    200: '#FDEDA3',
    300: '#FCE475',
    400: '#FBDB47',
    500: '#EAB308', // Warning
    600: '#CA9A07',
    700: '#976E05',
    800: '#674C03',
    900: '#332601',
  },
  error: {
    50: '#FEF0F0',
    100: '#FDDADA',
    200: '#FCBBBB',
    300: '#FA9595',
    400: '#F96D6D',
    500: '#EF4444', // Error
    600: '#D73232',
    700: '#B42020',
    800: '#7D1515',
    900: '#500E0E',
  },
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  background: {
    primary: '#F9FAFB',
    secondary: '#FFFFFF',
    tertiary: '#F3F4F6',
  },
};

export const FONTS = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

export const LINE_HEIGHTS = {
  xs: 16,
  sm: 20,
  base: 24,
  lg: 28,
  xl: 28,
  '2xl': 32,
  '3xl': 36,
  '4xl': 40,
  '5xl': 60,
};

export const SPACING = {
  px: 1,
  '0.5': 4,
  '1': 8,
  '1.5': 12,
  '2': 16,
  '2.5': 20,
  '3': 24,
  '3.5': 28,
  '4': 32,
  '5': 40,
  '6': 48,
  '7': 56,
  '8': 64,
  '9': 72,
  '10': 80,
  '11': 88,
  '12': 96,
};

export const SHADOW = {
  sm: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    ...Platform.select({
      android: {
        elevation: 2,
      },
    }),
  },
  base: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    ...Platform.select({
      android: {
        elevation: 4,
      },
    }),
  },
  md: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    ...Platform.select({
      android: {
        elevation: 6,
      },
    }),
  },
  lg: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    ...Platform.select({
      android: {
        elevation: 10,
      },
    }),
  },
};

export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  full: 9999,
};