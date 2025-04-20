import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Alert, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { fakeUser, User } from '@/data/fakeData';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
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
  },
  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Check if user is already logged in
    async function loadStoredUser() {
      try {
        const storedUser = await storage.getItem('user');
        if (storedUser && isMounted) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load auth user', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadStoredUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // In a real app, this would verify credentials with a server
      if (email.trim() && password.trim()) {
        // For now, we'll use our fake user
        await storage.setItem('user', JSON.stringify(fakeUser));
        setUser(fakeUser);
        return;
      }
      throw new Error('Invalid credentials');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in. Please check your credentials.');
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // In a real app, this would register the user with a server
      if (email.trim() && password.trim() && name.trim()) {
        // For now, we'll just use our fake user but with the new name
        const newUser = { ...fakeUser, name, email };
        await storage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
        return;
      }
      throw new Error('Invalid information');
    } catch (error) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await storage.removeItem('user');
      setUser(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out.');
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}