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
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Trash2, Clock } from 'lucide-react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { calculateNextBillingDate, formatCurrency } from '@/data/fakeData';

export default function SubscriptionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getSubscription, deleteSubscription } = useSubscriptions();
  const [isDeleting, setIsDeleting] = useState(false);

  const subscription = getSubscription(id as string);

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
              router.replace('/');
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.neutral[800]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription Details</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.platformHeader, { backgroundColor: subscription.color }]}>
          <View style={styles.platformLogoContainer}>
            <Image
              source={{ uri: subscription.platformLogo }}
              style={styles.platformLogo}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.platformName}>{subscription.platformName}</Text>
          <Text style={styles.platformCategory}>{subscription.category}</Text>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.price}>
              {formatCurrency(subscription.price, subscription.currency)}
              <Text style={styles.billingCycle}> / {subscription.billingCycle}</Text>
            </Text>
          </View>

          <View style={styles.divider} />

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

          <View style={styles.divider} />

          <View style={styles.nextPaymentAlert}>
            <Text style={styles.nextPaymentText}>
              Your next payment of {formatCurrency(subscription.price, subscription.currency)}{' '}
              is due on {format(nextBillingDate, 'MMMM d, yyyy')}.
            </Text>
          </View>
        </View>

        <View style={styles.actionSection}>
          <Button
            title="Delete Subscription"
            onPress={handleDelete}
            variant="outline"
            loading={isDeleting}
            disabled={isDeleting}
            icon={<Trash2 size={20} color={COLORS.error[500]} />}
            style={styles.deleteButton}
            textStyle={styles.deleteButtonText}
          />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING[3],
    paddingVertical: SPACING[2],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  backButton: {
    padding: SPACING[1],
  },
  headerTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.lg,
    color: COLORS.neutral[900],
    marginLeft: SPACING[2],
  },
  content: {
    flex: 1,
  },
  platformHeader: {
    alignItems: 'center',
    padding: SPACING[4],
  },
  platformLogoContainer: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    marginBottom: SPACING[2],
  },
  platformLogo: {
    width: 80,
    height: 80,
  },
  platformName: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES['2xl'],
    color: COLORS.white,
    marginBottom: SPACING[1],
  },
  platformCategory: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.base,
    color: COLORS.white,
    opacity: 0.9,
  },
  detailsCard: {
    margin: SPACING[4],
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING[4],
  },
  priceSection: {
    alignItems: 'center',
    marginBottom: SPACING[3],
  },
  priceLabel: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.base,
    color: COLORS.neutral[600],
    marginBottom: SPACING[1],
  },
  price: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES['3xl'],
    color: COLORS.neutral[900],
  },
  billingCycle: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.lg,
    color: COLORS.neutral[600],
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.neutral[200],
    marginVertical: SPACING[3],
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
  nextPaymentAlert: {
    backgroundColor: COLORS.primary[50],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING[3],
  },
  nextPaymentText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.base,
    color: COLORS.primary[700],
    textAlign: 'center',
  },
  actionSection: {
    padding: SPACING[4],
    paddingTop: 0,
  },
  deleteButton: {
    borderColor: COLORS.error[100],
  },
  deleteButtonText: {
    color: COLORS.error[500],
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