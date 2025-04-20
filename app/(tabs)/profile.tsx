import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LogOut, Mail, CreditCard as Edit, CircleHelp as HelpCircle, Bell, Shield } from 'lucide-react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/login');
            } catch (error) {
              console.error('Error signing out:', error);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <View style={styles.profileSection}>
          <Image
            source={{ uri: user?.avatar }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user?.name}</Text>
            <View style={styles.emailContainer}>
              <Mail size={16} color={COLORS.neutral[500]} />
              <Text style={styles.email}>{user?.email}</Text>
            </View>
          </View>
          <Button
            title="Edit"
            onPress={() => {}}
            variant="outline"
            size="sm"
            icon={<Edit size={16} color={COLORS.primary[500]} />}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          <View style={styles.optionCard}>
            <View style={styles.optionItem}>
              <View style={styles.optionIconContainer}>
                <Bell size={20} color={COLORS.primary[500]} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Notifications</Text>
                <Text style={styles.optionDescription}>Manage your notification preferences</Text>
              </View>
            </View>

            <View style={styles.optionItem}>
              <View style={styles.optionIconContainer}>
                <Shield size={20} color={COLORS.primary[500]} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Privacy & Security</Text>
                <Text style={styles.optionDescription}>Control your privacy settings</Text>
              </View>
            </View>

            <View style={styles.optionItem}>
              <View style={styles.optionIconContainer}>
                <HelpCircle size={20} color={COLORS.primary[500]} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Help & Support</Text>
                <Text style={styles.optionDescription}>Get help or contact support</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.signOutContainer}>
          <Button 
            title="Sign Out" 
            onPress={handleSignOut}
            variant="outline"
            icon={<LogOut size={20} color={COLORS.error[500]} />}
            style={styles.signOutButton}
            textStyle={{ color: COLORS.error[500] }}
          />
        </View>

        <View style={styles.appInfoContainer}>
          <Text style={styles.appVersionText}>Subscription Tracker v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  scrollContent: {
    paddingBottom: SPACING[8],
  },
  header: {
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[4],
    paddingBottom: SPACING[2],
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES['2xl'],
    color: COLORS.neutral[900],
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING[4],
    backgroundColor: COLORS.white,
    margin: SPACING[4],
    borderRadius: BORDER_RADIUS.lg,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: SPACING[3],
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.lg,
    color: COLORS.neutral[900],
    marginBottom: SPACING[0.5],
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  email: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.neutral[600],
    marginLeft: SPACING[0.5],
  },
  section: {
    paddingHorizontal: SPACING[4],
    marginBottom: SPACING[4],
  },
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.lg,
    color: COLORS.neutral[800],
    marginBottom: SPACING[2],
  },
  optionCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING[3],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING[2],
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.base,
    color: COLORS.neutral[800],
    marginBottom: SPACING[0.5],
  },
  optionDescription: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.neutral[500],
  },
  signOutContainer: {
    paddingHorizontal: SPACING[4],
    marginTop: SPACING[4],
  },
  signOutButton: {
    borderColor: COLORS.error[100],
  },
  appInfoContainer: {
    alignItems: 'center',
    marginTop: SPACING[8],
  },
  appVersionText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.neutral[500],
  },
});