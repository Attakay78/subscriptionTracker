import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { format, addMonths, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { calculateTotalMonthlyExpenses, formatCurrency } from '@/data/fakeData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_SIZE = SCREEN_WIDTH - SPACING[8] * 2;

type BillingType = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

interface CategoryTotal {
  category: string;
  amount: number;
  color: string;
}

function getMonthsForPeriod(type: BillingType, count: number = 3): Date[] {
  const today = new Date();
  const months: Date[] = [];
  
  for (let i = 0; i < count; i++) {
    months.push(subMonths(today, i));
  }
  
  return months.reverse();
}

function getCategoryColor(category: string): string {
  switch (category.toLowerCase()) {
    case 'entertainment':
      return COLORS.error[500];
    case 'health':
      return COLORS.success[500];
    case 'productivity':
      return COLORS.primary[500];
    case 'music':
      return COLORS.secondary[500];
    case 'gaming':
      return COLORS.accent[500];
    default:
      return COLORS.neutral[400];
  }
}

export default function OverviewScreen() {
  const { type } = useLocalSearchParams<{ type: BillingType }>();
  const router = useRouter();
  const { subscriptions } = useSubscriptions();

  const filteredSubscriptions = subscriptions.filter(sub => sub.billingCycle === type);
  const months = getMonthsForPeriod(type);
  
  const getCategoryTotals = (date: Date): CategoryTotal[] => {
    const totals: Record<string, number> = {};
    
    filteredSubscriptions.forEach(sub => {
      const category = sub.category;
      if (!totals[category]) {
        totals[category] = 0;
      }
      
      let amount = sub.price;
      if (type === 'weekly') {
        amount *= 4.33; // Average weeks per month
      } else if (type === 'quarterly') {
        amount /= 3;
      } else if (type === 'yearly') {
        amount /= 12;
      }
      
      totals[category] += amount;
    });

    return Object.entries(totals).map(([category, amount]) => ({
      category,
      amount,
      color: getCategoryColor(category),
    }));
  };

  const getMonthTotal = (categoryTotals: CategoryTotal[]): number => {
    return categoryTotals.reduce((sum, cat) => sum + cat.amount, 0);
  };

  const getMaxTotal = (): number => {
    return Math.max(...months.map(month => getMonthTotal(getCategoryTotals(month))));
  };

  const maxTotal = getMaxTotal();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.neutral[800]} />
        </TouchableOpacity>
        <Text style={styles.title}>
          {type.charAt(0).toUpperCase() + type.slice(1)} Overview
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {months.map(month => {
          const categoryTotals = getCategoryTotals(month);
          const monthTotal = getMonthTotal(categoryTotals);

          return (
            <View key={month.toISOString()} style={styles.monthSection}>
              <Text style={styles.monthTitle}>
                {format(month, 'MMMM yyyy')}
              </Text>

              <View style={styles.chartContainer}>
                <View style={styles.donutChart}>
                  <View style={styles.donutCenter}>
                    <Text style={styles.totalAmount}>
                      {formatCurrency(monthTotal, 'USD')}
                    </Text>
                    <Text style={styles.totalLabel}>Total</Text>
                  </View>
                </View>

                <View style={styles.categoriesList}>
                  {categoryTotals.map((cat, index) => (
                    <View key={cat.category} style={styles.categoryItem}>
                      <View style={styles.categoryHeader}>
                        <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
                        <Text style={styles.categoryName}>{cat.category}</Text>
                      </View>
                      <Text style={styles.categoryAmount}>
                        {formatCurrency(cat.amount, 'USD')}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          );
        })}
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
    padding: SPACING[4],
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  backButton: {
    marginRight: SPACING[3],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.xl,
    color: COLORS.neutral[900],
  },
  content: {
    flex: 1,
    padding: SPACING[4],
  },
  monthSection: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING[4],
    marginBottom: SPACING[4],
  },
  monthTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.lg,
    color: COLORS.neutral[900],
    marginBottom: SPACING[4],
  },
  chartContainer: {
    alignItems: 'center',
  },
  donutChart: {
    width: CHART_SIZE,
    height: CHART_SIZE,
    borderRadius: CHART_SIZE / 2,
    backgroundColor: COLORS.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING[4],
  },
  donutCenter: {
    width: CHART_SIZE - 80,
    height: CHART_SIZE - 80,
    borderRadius: (CHART_SIZE - 80) / 2,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalAmount: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES['3xl'],
    color: COLORS.neutral[900],
    marginBottom: SPACING[1],
  },
  totalLabel: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.base,
    color: COLORS.neutral[500],
  },
  categoriesList: {
    width: '100%',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING[2],
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING[2],
  },
  categoryName: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.base,
    color: COLORS.neutral[700],
  },
  categoryAmount: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.base,
    color: COLORS.neutral[900],
  },
});