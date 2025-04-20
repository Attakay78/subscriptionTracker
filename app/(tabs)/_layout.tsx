import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Chrome as Home, CirclePlus as PlusCircle, CircleUser as UserCircle } from 'lucide-react-native';
import { COLORS, FONTS, FONT_SIZES } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

export default function TabLayout() {
  const { user } = useAuth();

  // Redirect to auth if not logged in
  if (!user) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary[500],
        tabBarInactiveTintColor: COLORS.neutral[400],
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.neutral[200],
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: FONTS.medium,
          fontSize: FONT_SIZES.xs,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarIcon: ({ color, size }) => <PlusCircle size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <UserCircle size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}