import { Platform } from 'react-native';

export const COLORS = {
  primary: {
    50: '#FFF0F7',
    100: '#FFE1EF',
    200: '#FFC2DF',
    300: '#FF94C7',
    400: '#FF5FA8',
    500: '#E4405F', // Primary Instagram Red
    600: '#D6295A',
    700: '#B91D4D',
    800: '#931740',
    900: '#721334',
  },
  secondary: {
    50: '#FFF5F0',
    100: '#FFEADF',
    200: '#FFD4BF',
    300: '#FFAE8A',
    400: '#FF7D47',
    500: '#F77737', // Instagram Orange
    600: '#E85D1A',
    700: '#C44812',
    800: '#9C370E',
    900: '#7A2B0B',
  },
  accent: {
    50: '#F5F0FF',
    100: '#EBE0FF',
    200: '#D6C0FF',
    300: '#B894FF',
    400: '#9361FF',
    500: '#833AB4', // Instagram Purple
    600: '#6B2B99',
    700: '#561F7C',
    800: '#41175E',
    900: '#321147',
  },
  success: {
    50: '#EDFDF5',
    100: '#D3F8E2',
    200: '#A7F0C5',
    300: '#7BE7A8',
    400: '#4FDB8B',
    500: '#28A745', // Success Green
    600: '#1A9E4B',
    700: '#137539',
    800: '#0C4F27',
    900: '#062916',
  },
  warning: {
    50: '#FFF8E6',
    100: '#FFEFC3',
    200: '#FFE099',
    300: '#FFD066',
    400: '#FFC033',
    500: '#FCAF45', // Instagram Yellow
    600: '#E69A2C',
    700: '#B37721',
    800: '#805618',
    900: '#664412',
  },
  error: {
    50: '#FEF0F0',
    100: '#FDDADA',
    200: '#FCBBBB',
    300: '#FA9595',
    400: '#F96D6D',
    500: '#FD1D1D', // Instagram Red
    600: '#D73232',
    700: '#B42020',
    800: '#7D1515',
    900: '#500E0E',
  },
  neutral: {
    50: '#FAFAFA', // Instagram Background Light
    100: '#F5F5F5',
    200: '#EFEFEF',
    300: '#DBDBDB', // Instagram Border Color
    400: '#8E8E8E', // Instagram Secondary Text
    500: '#737373',
    600: '#262626', // Instagram Primary Text
    700: '#1A1A1A',
    800: '#121212',
    900: '#000000',
  },
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  background: {
    primary: '#FAFAFA', // Instagram Background
    secondary: '#FFFFFF',
    tertiary: '#F5F5F5',
  },
  gradient: {
    instagram: ['#833AB4', '#E4405F', '#F77737'], // Instagram Gradient
    story: ['#FD1D1D', '#833AB4', '#FCAF45'], // Instagram Story Gradient
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