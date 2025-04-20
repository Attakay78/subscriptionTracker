import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
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

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    async function loadStoredUser() {
      try {
        const storedUser = await SecureStore.getItemAsync('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load auth user', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // In a real app, this would verify credentials with a server
      if (email.trim() && password.trim()) {
        // For now, we'll use our fake user
        await SecureStore.setItemAsync('user', JSON.stringify(fakeUser));
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
        await SecureStore.setItemAsync('user', JSON.stringify(newUser));
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
      await SecureStore.deleteItemAsync('user');
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