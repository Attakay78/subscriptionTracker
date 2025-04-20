import { COLORS } from '@/constants/theme';

type SubscriptionPlatform = {
  id: string;
  name: string;
  logo: string;
  category: string;
  color: string;
};

export type Currency = {
  code: string;
  symbol: string;
  name: string;
};

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'GHS', symbol: '₵', name: 'Ghana Cedi' },
];

export const subscriptionPlatforms: SubscriptionPlatform[] = [
  {
    id: 'netflix',
    name: 'Netflix',
    logo: 'https://images.pexels.com/photos/11721884/pexels-photo-11721884.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Entertainment',
    color: '#E50914',
  },
  {
    id: 'spotify',
    name: 'Spotify',
    logo: 'https://images.pexels.com/photos/7845527/pexels-photo-7845527.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Music',
    color: '#1DB954',
  },
  {
    id: 'disney',
    name: 'Disney+',
    logo: 'https://images.pexels.com/photos/5727395/pexels-photo-5727395.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Entertainment',
    color: '#0063E5',
  },
  {
    id: 'hulu',
    name: 'Hulu',
    logo: 'https://images.pexels.com/photos/6801651/pexels-photo-6801651.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Entertainment',
    color: '#3DBB3D',
  },
  {
    id: 'amazon',
    name: 'Amazon Prime',
    logo: 'https://images.pexels.com/photos/6483582/pexels-photo-6483582.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Shopping & Entertainment',
    color: '#00A8E1',
  },
  {
    id: 'youtube',
    name: 'YouTube Premium',
    logo: 'https://images.pexels.com/photos/9228869/pexels-photo-9228869.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Entertainment',
    color: '#FF0000',
  },
  {
    id: 'apple-music',
    name: 'Apple Music',
    logo: 'https://images.pexels.com/photos/4319752/pexels-photo-4319752.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Music',
    color: '#FA243C',
  },
  {
    id: 'apple-tv',
    name: 'Apple TV+',
    logo: 'https://images.pexels.com/photos/5077045/pexels-photo-5077045.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Entertainment',
    color: '#000000',
  },
  {
    id: 'hbo-max',
    name: 'HBO Max',
    logo: 'https://images.pexels.com/photos/5329054/pexels-photo-5329054.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Entertainment',
    color: '#5822B4',
  },
  {
    id: 'paramount',
    name: 'Paramount+',
    logo: 'https://images.pexels.com/photos/7242693/pexels-photo-7242693.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Entertainment',
    color: '#0064FF',
  },
  {
    id: 'adobe',
    name: 'Adobe Creative Cloud',
    logo: 'https://images.pexels.com/photos/7014337/pexels-photo-7014337.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Productivity',
    color: '#FF0000',
  },
  {
    id: 'microsoft365',
    name: 'Microsoft 365',
    logo: 'https://images.pexels.com/photos/4195326/pexels-photo-4195326.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Productivity',
    color: '#0078D4',
  },
  {
    id: 'nintendo',
    name: 'Nintendo Switch Online',
    logo: 'https://images.pexels.com/photos/4219812/pexels-photo-4219812.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Gaming',
    color: '#E60012',
  },
  {
    id: 'playstation',
    name: 'PlayStation Plus',
    logo: 'https://images.pexels.com/photos/7324372/pexels-photo-7324372.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Gaming',
    color: '#003791',
  },
  {
    id: 'xbox',
    name: 'Xbox Game Pass',
    logo: 'https://images.pexels.com/photos/6462662/pexels-photo-6462662.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Gaming',
    color: '#107C10',
  },
  {
    id: 'canva',
    name: 'Canva Pro',
    logo: 'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Productivity',
    color: '#00C4CC',
  },
  {
    id: 'notion',
    name: 'Notion',
    logo: 'https://images.pexels.com/photos/8927488/pexels-photo-8927488.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Productivity',
    color: '#000000',
  },
  {
    id: 'figma',
    name: 'Figma',
    logo: 'https://images.pexels.com/photos/10283734/pexels-photo-10283734.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Productivity',
    color: '#F24E1E',
  },
  {
    id: 'github',
    name: 'GitHub',
    logo: 'https://images.pexels.com/photos/11281577/pexels-photo-11281577.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Development',
    color: '#181717',
  },
  {
    id: 'nytimes',
    name: 'New York Times',
    logo: 'https://images.pexels.com/photos/6053/newspapers-magazines-news-pages.jpg?auto=compress&cs=tinysrgb&w=100',
    category: 'News',
    color: '#000000',
  },
];

export type BillingCycle = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export const billingCycles: { label: string; value: BillingCycle }[] = [
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Yearly', value: 'yearly' },
];

export const getPlatform = (id: string) => {
  return subscriptionPlatforms.find((platform) => platform.id === id);
};

export const getCustomPlatform = (name: string): SubscriptionPlatform => {
  return {
    id: `custom-${Date.now()}`,
    name,
    logo: 'https://images.pexels.com/photos/5903666/pexels-photo-5903666.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Other',
    color: COLORS.neutral[500],
  };
};

export const getCurrencySymbol = (code: string): string => {
  return SUPPORTED_CURRENCIES.find(currency => currency.code === code)?.symbol || code;
};