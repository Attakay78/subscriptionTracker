import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  SafeAreaView, 
  RefreshControl, 
  Image, 
  Dimensions,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowDown, ArrowUp, ChevronDown, ArrowUpDown } from 'lucide-react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { SubscriptionCard } from '@/components/subscription/SubscriptionCard';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { useAuth } from '@/context/AuthContext';
import { calculateNextBillingDate, calculateTotalMonthlyExpenses, formatCurrency, Subscription, groupSubscriptionsByCurrency } from '@/data/fakeData';
import { SUPPORTED_CURRENCIES, getCurrencySymbol } from '@/data/subscriptionPlatforms';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - SPACING[4] * 2;
const CARD_SPACING = SPACING[4] * 2;

type BillingPeriod = {
  label: string;
  value: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  color: string;
};

type SortOption = {
  label: string;
  value: 'platformName' | 'price' | 'nextBilling' | 'currency';
};

type SortOrder = 'asc' | 'desc';

const BILLING_PERIODS: BillingPeriod[] = [
  { label: 'Weekly', value: 'weekly', color: COLORS.accent[500] },
  { label: 'Monthly', value: 'monthly', color: COLORS.primary[500] },
  { label: 'Quarterly', value: 'quarterly', color: COLORS.secondary[500] },
  { label: 'Yearly', value: 'yearly', color: COLORS.success[500] },
];

const SORT_OPTIONS: SortOption[] = [
  { label: 'Platform Name', value: 'platformName' },
  { label: 'Price', value: 'price' },
  { label: 'Next Billing Date', value: 'nextBilling' },
  { label: 'Currency', value: 'currency' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { subscriptions, isLoading } = useSubscriptions();
  const [refreshing, setRefreshing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption['value']>('platformName');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const scrollRef = useRef<FlatList>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollToIndex({
        index: 0,
        animated: false,
      });
    }
  }, []);

  const sortSubscriptions = (subs: Subscription[]) => {
    return [...subs].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'platformName':
          comparison = a.platformName.localeCompare(b.platformName);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'nextBilling':
          const dateA = calculateNextBillingDate(a.startDate, a.billingCycle);
          const dateB = calculateNextBillingDate(b.startDate, b.billingCycle);
          comparison = dateA.getTime() - dateB.getTime();
          break;
        case 'currency':
          comparison = a.currency.localeCompare(b.currency);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  const getFilteredSubscriptions = (billingCycle: string) => {
    const filtered = subscriptions.filter(sub => sub.billingCycle === billingCycle);
    return sortSubscriptions(filtered);
  };

  const calculateTotalForPeriod = (billingCycle: string) => {
    const filtered = subscriptions.filter(sub => sub.billingCycle === billingCycle);
    let total = filtered.reduce((sum, sub) => sum + sub.price, 0);
    
    switch (billingCycle) {
      case 'weekly':
        total *= 4.33;
        break;
      case 'quarterly':
        total /= 3;
        break;
      case 'yearly':
        total /= 12;
        break;
    }
    
    return total;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderSummaryCard = ({ item, index }: { item: BillingPeriod; index: number }) => {
    const currencyTotals = groupSubscriptionsByCurrency(
      subscriptions.filter(sub => sub.billingCycle === item.value)
    );
    const count = getFilteredSubscriptions(item.value).length;

    return (
      <TouchableOpacity 
        style={[styles.statsCard, { backgroundColor: item.color }]}
        onPress={() => router.push(`/overview/${item.value}`)}
      >
        <Text style={styles.statsTitle}>{item.label} Subscriptions</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.currencyTotalsContainer}
        >
          {Object.entries(currencyTotals).map(([currency, amount], idx) => (
            <View key={currency} style={styles.currencyTotal}>
              <Text style={styles.statsAmount}>
                {formatCurrency(amount, currency)}
              </Text>
              {idx < Object.entries(currencyTotals).length - 1 && (
                <Text style={styles.currencySeparator}>•</Text>
              )}
            </View>
          ))}
        </ScrollView>
        <Text style={styles.statsSubtitle}>
          {count} Active Subscription{count !== 1 ? 's' : ''}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item, index }: { item: Subscription; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
      <SubscriptionCard subscription={item} />
    </Animated.View>
  );

  const onScroll = (event: any) => {
    const x = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / (CARD_WIDTH + CARD_SPACING));
    setActiveIndex(index);
  };

  const handleSortChange = (option: SortOption['value']) => {
    if (sortBy === option) {
      setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortOrder('asc');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
        </View>
        <Image
          source={{ uri: user?.avatar }}
          style={styles.avatar}
        />
      </View>

      <View style={styles.summaryContainer}>
        <FlatList
          ref={scrollRef}
          data={BILLING_PERIODS}
          renderItem={renderSummaryCard}
          keyExtractor={(item) => item.value}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + CARD_SPACING}
          decelerationRate="fast"
          contentContainerStyle={styles.summaryList}
          onScroll={onScroll}
          initialScrollIndex={0}
        />
        
        <View style={styles.pagination}>
          {BILLING_PERIODS.map((period, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                activeIndex === index && [
                  styles.paginationDotActive,
                  { backgroundColor: period.color }
                ],
                activeIndex !== index && {
                  backgroundColor: `${period.color}40`
                }
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Your Subscriptions</Text>
          
          <View style={styles.sortingSection}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sortingOptions}
            >
              {SORT_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.sortingButton,
                    sortBy === option.value && styles.sortingButtonActive
                  ]}
                  onPress={() => handleSortChange(option.value)}
                >
                  <Text style={[
                    styles.sortingButtonText,
                    sortBy === option.value && styles.sortingButtonTextActive
                  ]}>
                    {option.label}
                  </Text>
                  {sortBy === option.value && (
                    <View style={styles.sortOrderIcon}>
                      {sortOrder === 'asc' ? (
                        <ArrowUp size={14} color={COLORS.primary[500]} />
                      ) : (
                        <ArrowDown size={14} color={COLORS.primary[500]} />
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
        
        <FlatList
          data={getFilteredSubscriptions(BILLING_PERIODS[activeIndex].value)}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary[500]]}
              tintColor={COLORS.primary[500]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No Subscriptions Yet</Text>
              <Text style={styles.emptySubtitle}>
                Add your first subscription by tapping the + tab below.
              </Text>
            </View>
          }
        />
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[4],
    paddingBottom: SPACING[2],
  },
  greeting: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.lg,
    color: COLORS.neutral[600],
  },
  userName: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES['2xl'],
    color: COLORS.neutral[900],
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  summaryContainer: {
    marginVertical: SPACING[2],
  },
  summaryList: {
    paddingHorizontal: SPACING[4],
    gap: CARD_SPACING,
  },
  statsCard: {
    padding: SPACING[4],
    borderRadius: 16,
    alignItems: 'center',
    height: 160,
    width: CARD_WIDTH,
  },
  statsTitle: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.base,
    color: COLORS.white,
    opacity: 0.9,
  },
  currencyTotalsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING[2],
  },
  currencyTotal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySeparator: {
    color: COLORS.white,
    opacity: 0.6,
    marginHorizontal: SPACING[2],
    fontSize: FONT_SIZES.lg,
  },
  statsAmount: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES['2xl'],
    color: COLORS.white,
  },
  statsSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    opacity: 0.8,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING[2],
    gap: SPACING[1],
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  paginationDotActive: {
    width: 24,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: SPACING[4],
  },
  listHeader: {
    marginBottom: SPACING[3],
  },
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.xl,
    color: COLORS.neutral[800],
    marginBottom: SPACING[2],
  },
  listContent: {
    paddingBottom: SPACING[10],
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING[8],
  },
  emptyTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.xl,
    color: COLORS.neutral[800],
    marginBottom: SPACING[1],
  },
  emptySubtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.base,
    color: COLORS.neutral[600],
    textAlign: 'center',
    paddingHorizontal: SPACING[4],
  },
  sortingSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortingOptions: {
    flexDirection: 'row',
    gap: SPACING[2],
  },
  sortingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING[1.5],
    paddingHorizontal: SPACING[2],
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    gap: SPACING[1],
  },
  sortingButtonActive: {
    backgroundColor: COLORS.primary[50],
    borderColor: COLORS.primary[200],
  },
  sortingButtonText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: COLORS.neutral[600],
  },
  sortingButtonTextActive: {
    color: COLORS.primary[700],
  },
  sortOrderIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});