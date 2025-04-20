import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Subscription, fakeSubscriptions } from '@/data/fakeData';
import { useAuth } from './AuthContext';

interface SubscriptionContextType {
  subscriptions: Subscription[];
  isLoading: boolean;
  addSubscription: (subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Subscription>;
  updateSubscription: (id: string, data: Partial<Subscription>) => Promise<Subscription>;
  deleteSubscription: (id: string) => Promise<void>;
  getSubscription: (id: string) => Subscription | undefined;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function loadSubscriptions() {
      try {
        if (!user) {
          setSubscriptions([]);
          return;
        }
        
        setIsLoading(true);
        // In a real app, we would fetch from an API
        // For now, use fake data and SecureStore for persistence
        const storedData = await SecureStore.getItemAsync('subscriptions');
        
        if (storedData) {
          const parsedData = JSON.parse(storedData) as Subscription[];
          // Filter subscriptions for the current user
          setSubscriptions(parsedData.filter(sub => sub.userId === user.id));
        } else {
          // First time - use fake data
          await SecureStore.setItemAsync('subscriptions', JSON.stringify(fakeSubscriptions));
          setSubscriptions(fakeSubscriptions.filter(sub => sub.userId === user.id));
        }
      } catch (error) {
        console.error('Failed to load subscriptions', error);
        Alert.alert('Error', 'Failed to load your subscriptions.');
      } finally {
        setIsLoading(false);
      }
    }

    loadSubscriptions();
  }, [user]);

  const saveSubscriptions = async (newSubscriptions: Subscription[]) => {
    try {
      // Get all subscriptions (including other users) to avoid losing data
      const storedData = await SecureStore.getItemAsync('subscriptions');
      let allSubscriptions: Subscription[] = [];
      
      if (storedData) {
        const parsedData = JSON.parse(storedData) as Subscription[];
        // Keep subscriptions from other users
        allSubscriptions = parsedData.filter(sub => !user || sub.userId !== user.id);
      }
      
      // Add the current user's subscriptions
      allSubscriptions = [...allSubscriptions, ...newSubscriptions];
      
      // Save all subscriptions back to storage
      await SecureStore.setItemAsync('subscriptions', JSON.stringify(allSubscriptions));
    } catch (error) {
      console.error('Failed to save subscriptions', error);
      throw new Error('Failed to save subscriptions');
    }
  };

  const addSubscription = async (subscriptionData: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const timestamp = new Date().toISOString();
      const newSubscription: Subscription = {
        ...subscriptionData,
        id: `sub-${Date.now()}`,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      
      const updatedSubscriptions = [...subscriptions, newSubscription];
      await saveSubscriptions(updatedSubscriptions);
      setSubscriptions(updatedSubscriptions);
      
      return newSubscription;
    } catch (error) {
      console.error('Failed to add subscription', error);
      Alert.alert('Error', 'Failed to add subscription.');
      throw error;
    }
  };

  const updateSubscription = async (id: string, data: Partial<Subscription>) => {
    try {
      const updatedSubscriptions = subscriptions.map(subscription => {
        if (subscription.id === id) {
          return {
            ...subscription,
            ...data,
            updatedAt: new Date().toISOString(),
          };
        }
        return subscription;
      });
      
      await saveSubscriptions(updatedSubscriptions);
      setSubscriptions(updatedSubscriptions);
      
      const updated = updatedSubscriptions.find(sub => sub.id === id);
      if (!updated) {
        throw new Error('Subscription not found');
      }
      
      return updated;
    } catch (error) {
      console.error('Failed to update subscription', error);
      Alert.alert('Error', 'Failed to update subscription.');
      throw error;
    }
  };

  const deleteSubscription = async (id: string) => {
    try {
      const updatedSubscriptions = subscriptions.filter(subscription => subscription.id !== id);
      await saveSubscriptions(updatedSubscriptions);
      setSubscriptions(updatedSubscriptions);
    } catch (error) {
      console.error('Failed to delete subscription', error);
      Alert.alert('Error', 'Failed to delete subscription.');
      throw error;
    }
  };

  const getSubscription = (id: string) => {
    return subscriptions.find(subscription => subscription.id === id);
  };

  const value = {
    subscriptions,
    isLoading,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    getSubscription,
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscriptions() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscriptions must be used within a SubscriptionProvider');
  }
  return context;
}