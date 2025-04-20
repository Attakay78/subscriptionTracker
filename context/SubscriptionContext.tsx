import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Alert, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Subscription, fakeSubscriptions } from '@/data/fakeData';
import { useAuth } from './AuthContext';

interface SubscriptionContextType {
  subscriptions: Subscription[];
  customPlatforms: any[];
  isLoading: boolean;
  addSubscription: (subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Subscription>;
  updateSubscription: (id: string, data: Partial<Subscription>) => Promise<Subscription>;
  deleteSubscription: (id: string) => Promise<void>;
  getSubscription: (id: string) => Subscription | undefined;
  addCustomPlatform: (platform: any) => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

interface SubscriptionProviderProps {
  children: ReactNode;
}

// Helper functions for storage operations
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }
};

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [customPlatforms, setCustomPlatforms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        if (!user) {
          if (isMounted) {
            setSubscriptions([]);
            setCustomPlatforms([]);
          }
          return;
        }
        
        if (isMounted) {
          setIsLoading(true);
        }
        
        // Load subscriptions
        const storedData = await storage.getItem('subscriptions');
        if (storedData && isMounted) {
          const parsedData = JSON.parse(storedData) as Subscription[];
          setSubscriptions(parsedData.filter(sub => sub.userId === user.id));
        } else if (isMounted) {
          await storage.setItem('subscriptions', JSON.stringify(fakeSubscriptions));
          setSubscriptions(fakeSubscriptions.filter(sub => sub.userId === user.id));
        }

        // Load custom platforms
        const storedPlatforms = await storage.getItem('customPlatforms');
        if (storedPlatforms && isMounted) {
          setCustomPlatforms(JSON.parse(storedPlatforms));
        }
      } catch (error) {
        console.error('Failed to load data', error);
        Alert.alert('Error', 'Failed to load your subscriptions.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const saveSubscriptions = async (newSubscriptions: Subscription[]) => {
    try {
      const storedData = await storage.getItem('subscriptions');
      let allSubscriptions: Subscription[] = [];
      
      if (storedData) {
        const parsedData = JSON.parse(storedData) as Subscription[];
        allSubscriptions = parsedData.filter(sub => !user || sub.userId !== user.id);
      }
      
      allSubscriptions = [...allSubscriptions, ...newSubscriptions];
      await storage.setItem('subscriptions', JSON.stringify(allSubscriptions));
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

  const addCustomPlatform = async (platform: any) => {
    try {
      const updatedPlatforms = [...customPlatforms, platform];
      await storage.setItem('customPlatforms', JSON.stringify(updatedPlatforms));
      setCustomPlatforms(updatedPlatforms);
    } catch (error) {
      console.error('Failed to save custom platform', error);
      throw error;
    }
  };

  const value = {
    subscriptions,
    customPlatforms,
    isLoading,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    getSubscription,
    addCustomPlatform,
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