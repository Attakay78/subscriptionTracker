import React from 'react';
import { StyleSheet, Text, View, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { format, differenceInDays } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { formatCurrency, calculateNextBillingDate, Subscription } from '@/data/fakeData';

interface SubscriptionCardProps {
  subscription: Subscription;
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const router = useRouter();
  const {
    id,
    platformName,
    platformLogo,
    price,
    currency,
    startDate,
    billingCycle,
    color,
  } = subscription;

  const nextBillingDate = calculateNextBillingDate(startDate, billingCycle);
  const daysUntilBilling = differenceInDays(nextBillingDate, new Date());
  const isNearBilling = daysUntilBilling <= 3; // Consider 3 days as "near billing"
  
  const navigateToDetails = () => {
    router.push(`/subscription/${id}`);
  };

  return (
    <Card 
      onPress={navigateToDetails}
      style={styles.card}
      elevation="md"
    >
      {isNearBilling && (
        <LinearGradient
          colors={['rgba(239, 68, 68, 0.1)', 'rgba(239, 68, 68, 0.05)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.warningGradient}
        />
      )}
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <View style={[styles.logoBackground, { backgroundColor: color || COLORS.neutral[200] }]}>
            <Image
              source={{ uri: platformLogo }}
              style={styles.logo}
              resizeMode="cover"
            />
          </View>
        </View>
        <View style={styles.content}>
          <Text style={styles.name}>{platformName}</Text>
          <Text style={styles.price}>
            {formatCurrency(price, currency)}
            <Text style={styles.cycle}> / {billingCycle}</Text>
          </Text>
          <View style={[
            styles.nextBilling,
            isNearBilling && styles.nextBillingWarning
          ]}>
            <Text style={[
              styles.nextBillingLabel,
              isNearBilling && styles.nextBillingLabelWarning
            ]}>
              {isNearBilling ? 'Due Soon' : 'Next billing'}
            </Text>
            <Text style={[
              styles.nextBillingDate,
              isNearBilling && styles.nextBillingDateWarning
            ]}>
              {format(nextBillingDate, 'MMM d, yyyy')}
              {isNearBilling && ` (${daysUntilBilling} days)`}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING[2],
    overflow: 'hidden',
  },
  warningGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: BORDER_RADIUS.lg,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    marginRight: SPACING[3],
  },
  logoBackground: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: 60,
    height: 60,
  },
  content: {
    flex: 1,
  },
  name: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.lg,
    color: COLORS.neutral[900],
    marginBottom: SPACING[0.5],
  },
  price: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.xl,
    color: COLORS.neutral[900],
    marginBottom: SPACING[1],
  },
  cycle: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.neutral[500],
  },
  nextBilling: {
    backgroundColor: COLORS.neutral[100],
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING[0.5],
    paddingHorizontal: SPACING[1],
    alignSelf: 'flex-start',
  },
  nextBillingWarning: {
    backgroundColor: COLORS.error[50],
  },
  nextBillingLabel: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: COLORS.neutral[500],
  },
  nextBillingLabelWarning: {
    color: COLORS.error[700],
    fontFamily: FONTS.medium,
  },
  nextBillingDate: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: COLORS.neutral[800],
  },
  nextBillingDateWarning: {
    color: COLORS.error[700],
  },
});