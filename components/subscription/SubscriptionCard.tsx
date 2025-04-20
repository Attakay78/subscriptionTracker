import React from 'react';
import { StyleSheet, Text, View, Image, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { differenceInDays } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { formatCurrency, calculateNextBillingDate, Subscription } from '@/data/fakeData';

interface SubscriptionCardProps {
  subscription: Subscription;
  onPress?: () => void;
}

export function SubscriptionCard({ subscription, onPress }: SubscriptionCardProps) {
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
  const isNearBilling = daysUntilBilling <= 3;
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/subscription/${id}`);
    }
  };

  const getBillingStatusText = () => {
    if (daysUntilBilling === 0) return 'Due today';
    if (daysUntilBilling === 1) return 'Due tomorrow';
    if (daysUntilBilling < 0) return `${Math.abs(daysUntilBilling)} days overdue`;
    return `${daysUntilBilling} days left`;
  };

  return (
    <Card 
      onPress={handlePress}
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
        <View style={[styles.logoContainer, { backgroundColor: color }]}>
          <Image
            source={{ uri: platformLogo }}
            style={styles.logo}
            resizeMode="cover"
          />
        </View>
        <View style={styles.content}>
          <View style={styles.mainContent}>
            <Text style={styles.name} numberOfLines={1}>{platformName}</Text>
            <Text style={styles.price}>{formatCurrency(price, currency)}</Text>
          </View>
          <View style={[
            styles.statusBadge,
            isNearBilling && styles.statusBadgeWarning
          ]}>
            <Text style={[
              styles.statusText,
              isNearBilling && styles.statusTextWarning
            ]}>
              {getBillingStatusText()}
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
    padding: SPACING[1.5],
    gap: SPACING[2],
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
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
  logo: {
    width: 48,
    height: 48,
  },
  content: {
    flex: 1,
    gap: SPACING[1],
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.base,
    color: COLORS.neutral[900],
    flex: 1,
    marginRight: SPACING[2],
  },
  price: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.lg,
    color: COLORS.neutral[900],
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: SPACING[1.5],
    backgroundColor: COLORS.neutral[100],
    borderRadius: BORDER_RADIUS.full,
  },
  statusBadgeWarning: {
    backgroundColor: COLORS.error[50],
  },
  statusText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.xs,
    color: COLORS.neutral[700],
  },
  statusTextWarning: {
    color: COLORS.error[700],
  },
});