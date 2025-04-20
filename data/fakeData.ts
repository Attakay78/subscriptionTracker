import { addDays, addMonths, addWeeks, addYears } from 'date-fns';
import { BillingCycle, getCurrencySymbol } from './subscriptionPlatforms';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
}

export interface Subscription {
  id: string;
  userId: string;
  platformId: string;
  platformName: string;
  platformLogo: string;
  color: string;
  price: number;
  currency: string;
  startDate: string;
  billingCycle: BillingCycle;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface BillingHistory {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  startDate: string;
  endDate: string;
  status: 'paid' | 'pending' | 'failed';
}

export const fakeUser: User = {
  id: '1',
  email: 'user@example.com',
  name: 'Alex Johnson',
  avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200',
};

export const fakeSubscriptions: Subscription[] = [
  {
    id: '1',
    userId: '1',
    platformId: 'netflix',
    platformName: 'Netflix',
    platformLogo: 'https://images.pexels.com/photos/11721884/pexels-photo-11721884.jpeg?auto=compress&cs=tinysrgb&w=100',
    color: '#E50914',
    price: 15.99,
    currency: 'USD',
    startDate: new Date(2023, 0, 15).toISOString(),
    billingCycle: 'monthly',
    category: 'Entertainment',
    createdAt: new Date(2023, 0, 15).toISOString(),
    updatedAt: new Date(2023, 0, 15).toISOString(),
  },
  {
    id: '2',
    userId: '1',
    platformId: 'spotify',
    platformName: 'Spotify',
    platformLogo: 'https://images.pexels.com/photos/7845527/pexels-photo-7845527.jpeg?auto=compress&cs=tinysrgb&w=100',
    color: '#1DB954',
    price: 9.99,
    currency: 'USD',
    startDate: addDays(new Date(), -28).toISOString(),
    billingCycle: 'monthly',
    category: 'Music',
    createdAt: new Date(2023, 1, 10).toISOString(),
    updatedAt: new Date(2023, 1, 10).toISOString(),
  },
  {
    id: '3',
    userId: '1',
    platformId: 'adobe',
    platformName: 'Adobe Creative Cloud',
    platformLogo: 'https://images.pexels.com/photos/7014337/pexels-photo-7014337.jpeg?auto=compress&cs=tinysrgb&w=100',
    color: '#FF0000',
    price: 52.99,
    currency: 'USD',
    startDate: new Date(2022, 11, 5).toISOString(),
    billingCycle: 'monthly',
    category: 'Productivity',
    createdAt: new Date(2022, 11, 5).toISOString(),
    updatedAt: new Date(2022, 11, 5).toISOString(),
  },
  {
    id: '4',
    userId: '1',
    platformId: 'youtube',
    platformName: 'YouTube Premium',
    platformLogo: 'https://images.pexels.com/photos/9228869/pexels-photo-9228869.jpeg?auto=compress&cs=tinysrgb&w=100',
    color: '#FF0000',
    price: 11.99,
    currency: 'USD',
    startDate: new Date(2023, 2, 20).toISOString(),
    billingCycle: 'monthly',
    category: 'Entertainment',
    createdAt: new Date(2023, 2, 20).toISOString(),
    updatedAt: new Date(2023, 2, 20).toISOString(),
  },
  {
    id: '5',
    userId: '1',
    platformId: 'microsoft365',
    platformName: 'Microsoft 365',
    platformLogo: 'https://images.pexels.com/photos/4195326/pexels-photo-4195326.jpeg?auto=compress&cs=tinysrgb&w=100',
    color: '#0078D4',
    price: 99.99,
    currency: 'USD',
    startDate: new Date(2022, 8, 15).toISOString(),
    billingCycle: 'yearly',
    category: 'Productivity',
    createdAt: new Date(2022, 8, 15).toISOString(),
    updatedAt: new Date(2022, 8, 15).toISOString(),
  },
  {
    id: '6',
    userId: '1',
    platformId: 'canva',
    platformName: 'Canva Pro',
    platformLogo: 'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=100',
    color: '#00C4CC',
    price: 3.99,
    currency: 'USD',
    startDate: addDays(new Date(), -5).toISOString(),
    billingCycle: 'weekly',
    category: 'Productivity',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const fakeBillingHistory: BillingHistory[] = [
  {
    id: 'bill-1',
    subscriptionId: '1',
    amount: 15.99,
    currency: 'USD',
    startDate: '2024-01-15',
    endDate: '2024-02-14',
    status: 'paid',
  },
  {
    id: 'bill-2',
    subscriptionId: '1',
    amount: 15.99,
    currency: 'USD',
    startDate: '2023-12-15',
    endDate: '2024-01-14',
    status: 'paid',
  },
  {
    id: 'bill-3',
    subscriptionId: '2',
    amount: 9.99,
    currency: 'USD',
    startDate: '2024-01-28',
    endDate: '2024-02-27',
    status: 'pending',
  },
  {
    id: 'bill-4',
    subscriptionId: '2',
    amount: 9.99,
    currency: 'USD',
    startDate: '2023-12-28',
    endDate: '2024-01-27',
    status: 'paid',
  },
  {
    id: 'bill-5',
    subscriptionId: '3',
    amount: 52.99,
    currency: 'USD',
    startDate: '2024-01-05',
    endDate: '2024-02-04',
    status: 'paid',
  },
  {
    id: 'bill-6',
    subscriptionId: '3',
    amount: 52.99,
    currency: 'USD',
    startDate: '2023-12-05',
    endDate: '2024-01-04',
    status: 'paid',
  },
];

export function calculateNextBillingDate(startDate: string, billingCycle: BillingCycle): Date {
  const start = new Date(startDate);
  const today = new Date();
  
  let nextBillingDate: Date;
  let tempDate = new Date(start);
  
  switch (billingCycle) {
    case 'weekly':
      while (tempDate <= today) {
        tempDate = addWeeks(tempDate, 1);
      }
      nextBillingDate = tempDate;
      break;
    
    case 'monthly':
      while (tempDate <= today) {
        tempDate = addMonths(tempDate, 1);
      }
      nextBillingDate = tempDate;
      break;
    
    case 'quarterly':
      while (tempDate <= today) {
        tempDate = addMonths(tempDate, 3);
      }
      nextBillingDate = tempDate;
      break;
    
    case 'yearly':
      while (tempDate <= today) {
        tempDate = addYears(tempDate, 1);
      }
      nextBillingDate = tempDate;
      break;
      
    default:
      nextBillingDate = today;
  }
  
  return nextBillingDate;
}

export function calculateTotalMonthlyExpenses(subscriptions: Subscription[]): number {
  return subscriptions.reduce((total, subscription) => {
    let monthlyAmount = subscription.price;
    
    switch (subscription.billingCycle) {
      case 'weekly':
        monthlyAmount = subscription.price * 4.33;
        break;
      case 'quarterly':
        monthlyAmount = subscription.price / 3;
        break;
      case 'yearly':
        monthlyAmount = subscription.price / 12;
        break;
    }
    
    return total + monthlyAmount;
  }, 0);
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${amount.toFixed(2)}`;
}

export function groupSubscriptionsByCurrency(subscriptions: Subscription[]): Record<string, number> {
  return subscriptions.reduce((acc, sub) => {
    const { currency, price, billingCycle } = sub;
    let monthlyAmount = price;
    
    switch (billingCycle) {
      case 'weekly':
        monthlyAmount *= 4.33;
        break;
      case 'quarterly':
        monthlyAmount /= 3;
        break;
      case 'yearly':
        monthlyAmount /= 12;
        break;
    }
    
    acc[currency] = (acc[currency] || 0) + monthlyAmount;
    return acc;
  }, {} as Record<string, number>);
}

export function getBillingHistory(subscriptionId: string): BillingHistory[] {
  return fakeBillingHistory.filter(bill => bill.subscriptionId === subscriptionId);
}