import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  Image, 
  ScrollView, 
  Alert,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Trash2, Clock } from 'lucide-react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { calculateNextBillingDate, formatCurrency, getBillingHistory } from '@/data/fakeData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - SPACING[8];

export default function SubscriptionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getSubscription, deleteSubscription } = useSubscriptions();
  const [isDeleting, setIsDeleting] = useState(false);

  const subscription = getSubscription(id as string);
  const billingHistory = getBillingHistory(id as string);

  if (!subscription) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={COLORS.neutral[800]} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Subscription Details</Text>
        </View>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Subscription not found</Text>
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const nextBillingDate = calculateNextBillingDate(
    subscription.startDate,
    subscription.billingCycle
  );

  const handleDelete = () => {
    Alert.alert(
      'Delete Subscription',
      `Are you sure you want to delete your ${subscription.platformName} subscription?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);
              await deleteSubscription(subscription.id);
              router.replace('/(tabs)');
            } catch (error) {
              console.error('Failed to delete subscription:', error);
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={COLORS.neutral[800]} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleDelete} 
            style={styles.deleteButton}
            disabled={isDeleting}
          >
            <Trash2 size={24} color={COLORS.error[500]} />
          </TouchableOpacity>
        </View>

        <View style={styles.platformCard}>
          <View style={styles.platformHeader}>
            <View style={[styles.logoContainer, { backgroundColor: subscription.color }]}>
              <Image
                source={{ uri: subscription.platformLogo }}
                style={styles.logo}
                resizeMode="cover"
              />
            </View>
            <View style={styles.platformInfo}>
              <Text style={styles.platformName}>{subscription.platformName}</Text>
              <Text style={styles.platformCategory}>{subscription.category}</Text>
              <Text style={styles.price}>
                {formatCurrency(subscription.price, subscription.currency)}
                <Text style={styles.billingCycle}> / {subscription.billingCycle}</Text>
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <View style={styles.infoIconContainer}>
                  <Calendar size={20} color={COLORS.primary[500]} />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Started On</Text>
                  <Text style={styles.infoValue}>
                    {format(new Date(subscription.startDate), 'MMM d, yyyy')}
                  </Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoIconContainer}>
                  <Clock size={20} color={COLORS.primary[500]} />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Next Payment</Text>
                  <Text style={styles.infoValue}>
                    {format(nextBillingDate, 'MMM d, yyyy')}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.billingHistorySection}>
            <Text style={styles.sectionTitle}>Billing History</Text>
            {billingHistory.map((bill) => (
              <View key={bill.id} style={styles.billingHistoryCard}>
                <View style={styles.billingHistoryHeader}>
                  <View style={styles.billingHistoryLeft}>
                    <Text style={styles.billingHistoryAmount}>
                      {formatCurrency(bill.amount, bill.currency)}
                    </Text>
                    <Text style={styles.billingHistoryPeriod}>
                      {format(new Date(bill.startDate), 'MMM d')} - {format(new Date(bill.endDate), 'MMM d, yyyy')}
                    </Text>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    styles[`status${bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}`]
                  ]}>
                    <Text style={[
                      styles.statusText,
                      styles[`status${bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}Text`]
                    ]}>
                      {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
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
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING[4],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.error[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  platformCard: {
    margin: SPACING[4],
    marginTop: 0,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING[4],
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  platformHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginRight: SPACING[3],
  },
  logo: {
    width: 60,
    height: 60,
  },
  platformInfo: {
    flex: 1,
  },
  platformName: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.xl,
    color: COLORS.neutral[900],
    marginBottom: SPACING[0.5],
  },
  platformCategory: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: COLORS.neutral[500],
    marginBottom: SPACING[1],
  },
  price: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES['2xl'],
    color: COLORS.neutral[900],
  },
  billingCycle: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.base,
    color: COLORS.neutral[500],
  },
  detailsSection: {
    padding: SPACING[4],
    paddingTop: 0,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING[4],
    marginBottom: SPACING[4],
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING[2],
  },
  infoLabel: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.neutral[600],
    marginBottom: SPACING[0.5],
  },
  infoValue: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.base,
    color: COLORS.neutral[900],
  },
  billingHistorySection: {
    marginBottom: SPACING[4],
  },
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.lg,
    color: COLORS.neutral[800],
    marginBottom: SPACING[2],
  },
  billingHistoryCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING[3],
    marginBottom: SPACING[2],
  },
  billingHistoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  billingHistoryLeft: {
    flex: 1,
  },
  billingHistoryAmount: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.lg,
    color: COLORS.neutral[900],
    marginBottom: SPACING[0.5],
  },
  billingHistoryPeriod: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: COLORS.neutral[600],
  },
  statusBadge: {
    paddingHorizontal: SPACING[2],
    paddingVertical: SPACING[0.5],
    borderRadius: BORDER_RADIUS.full,
  },
  statusPaid: {
    backgroundColor: COLORS.success[50],
  },
  statusPending: {
    backgroundColor: COLORS.warning[50],
  },
  statusFailed: {
    backgroundColor: COLORS.error[50],
  },
  statusText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.xs,
  },
  statusPaidText: {
    color: COLORS.success[700],
  },
  statusPendingText: {
    color: COLORS.warning[700],
  },
  statusFailedText: {
    color: COLORS.error[700],
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING[4],
  },
  notFoundText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.lg,
    color: COLORS.neutral[700],
    marginBottom: SPACING[3],
  },
});