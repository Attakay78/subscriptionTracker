import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  Pressable,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ChevronDown } from 'lucide-react-native';
import { format, addMonths, startOfMonth, endOfMonth, subMonths, subYears } from 'date-fns';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { calculateTotalMonthlyExpenses, formatCurrency } from '@/data/fakeData';
import { SUPPORTED_CURRENCIES, getCurrencySymbol } from '@/data/subscriptionPlatforms';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_SIZE = SCREEN_WIDTH - SPACING[8] * 2;
const DONUT_WIDTH = 40;
const RADIUS = (CHART_SIZE - DONUT_WIDTH) / 2;
const CENTER = CHART_SIZE / 2;

type BillingType = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

interface CategoryTotal {
  category: string;
  amount: number;
  color: string;
}

function getPeriodsForType(type: BillingType): { label: string; startDate: Date; endDate: Date }[] {
  const today = new Date();
  
  switch (type) {
    case 'quarterly': {
      const currentQuarterMonth = Math.floor(today.getMonth() / 3) * 3;
      const currentQuarterStart = new Date(today.getFullYear(), currentQuarterMonth, 1);
      const previousQuarterStart = new Date(today.getFullYear(), currentQuarterMonth - 3, 1);
      
      return [
        {
          label: `Q${Math.floor(currentQuarterMonth / 3) + 1} ${today.getFullYear()}`,
          startDate: currentQuarterStart,
          endDate: new Date(today.getFullYear(), currentQuarterMonth + 3, 0),
        },
        {
          label: `Q${Math.floor((currentQuarterMonth - 3) / 3) + 1} ${previousQuarterStart.getFullYear()}`,
          startDate: previousQuarterStart,
          endDate: new Date(today.getFullYear(), currentQuarterMonth - 1, 0),
        },
      ];
    }
    
    case 'yearly': {
      return [
        {
          label: `${today.getFullYear()}`,
          startDate: new Date(today.getFullYear(), 0, 1),
          endDate: new Date(today.getFullYear(), 11, 31),
        },
        {
          label: `${today.getFullYear() - 1}`,
          startDate: new Date(today.getFullYear() - 1, 0, 1),
          endDate: new Date(today.getFullYear() - 1, 11, 31),
        },
      ];
    }
    
    default: {
      const months: { label: string; startDate: Date; endDate: Date }[] = [];
      for (let i = 0; i < 3; i++) {
        const date = subMonths(today, i);
        months.push({
          label: format(date, 'MMMM yyyy'),
          startDate: startOfMonth(date),
          endDate: endOfMonth(date),
        });
      }
      return months.reverse();
    }
  }
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

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  
  return [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
}

export default function OverviewScreen() {
  const { type } = useLocalSearchParams<{ type: BillingType }>();
  const router = useRouter();
  const { subscriptions } = useSubscriptions();
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  const filteredSubscriptions = subscriptions.filter(sub => sub.billingCycle === type);
  const periods = getPeriodsForType(type);
  
  const getCategoryTotals = (startDate: Date, endDate: Date): CategoryTotal[] => {
    const totals: Record<string, number> = {};
    let total = 0;
    
    filteredSubscriptions.forEach(sub => {
      const category = sub.category;
      if (!totals[category]) {
        totals[category] = 0;
      }
      
      let amount = sub.price;
      if (type === 'weekly') {
        amount *= 4.33;
      } else if (type === 'quarterly') {
        amount /= 3;
      } else if (type === 'yearly') {
        amount /= 12;
      }
      
      const convertedAmount = amount;
      totals[category] += convertedAmount;
      total += convertedAmount;
    });

    return Object.entries(totals).map(([category, amount]) => {
      const periodAmount = type === 'quarterly' ? amount * 3 : type === 'yearly' ? amount * 12 : amount;
      return {
        category,
        amount: periodAmount,
        color: getCategoryColor(category),
      };
    }).sort((a, b) => b.amount - a.amount);
  };

  const getTotal = (categoryTotals: CategoryTotal[]): number => {
    return categoryTotals.reduce((sum, cat) => sum + cat.amount, 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.neutral[800]} />
        </TouchableOpacity>
        <Text style={styles.title}>
          {type.charAt(0).toUpperCase() + type.slice(1)} Overview
        </Text>
        <TouchableOpacity 
          style={styles.currencySelector}
          onPress={() => setShowCurrencyPicker(true)}
        >
          <Text style={styles.currencyText}>{selectedCurrency}</Text>
          <ChevronDown size={16} color={COLORS.neutral[500]} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {periods.map(period => {
          const categoryTotals = getCategoryTotals(period.startDate, period.endDate);
          const total = getTotal(categoryTotals);
          let startAngle = 0;
          const totalPercentage = 360;
          const sliceAngle = totalPercentage / categoryTotals.length;

          return (
            <View key={period.label} style={styles.periodSection}>
              <Text style={styles.periodTitle}>{period.label}</Text>

              <View style={styles.chartContainer}>
                <View style={styles.donutChart}>
                  <Svg width={CHART_SIZE} height={CHART_SIZE}>
                    <G transform={`translate(${CENTER}, ${CENTER})`}>
                      {categoryTotals.map((category, index) => {
                        const endAngle = startAngle + sliceAngle;
                        const path = describeArc(
                          0,
                          0,
                          RADIUS,
                          startAngle,
                          endAngle
                        );
                        const currentPath = (
                          <Path
                            key={index}
                            d={path}
                            fill="none"
                            stroke={category.color}
                            strokeWidth={DONUT_WIDTH}
                          />
                        );
                        startAngle = endAngle;
                        return currentPath;
                      })}
                      <Circle r={RADIUS - DONUT_WIDTH / 2} fill={COLORS.white} />
                    </G>
                  </Svg>
                  <View style={styles.donutCenter}>
                    <Text style={styles.totalAmount}>
                      {formatCurrency(total, selectedCurrency)}
                    </Text>
                    <Text style={styles.totalLabel}>
                      {type === 'quarterly' ? 'Quarter Total' : type === 'yearly' ? 'Year Total' : 'Month Total'}
                    </Text>
                  </View>
                </View>

                <View style={styles.categoriesCard}>
                  {categoryTotals.map((cat) => (
                    <View key={cat.category} style={styles.categoryItem}>
                      <View style={styles.categoryHeader}>
                        <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
                        <Text style={styles.categoryName}>{cat.category}</Text>
                      </View>
                      <Text style={styles.categoryAmount}>
                        {formatCurrency(cat.amount, selectedCurrency)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {type === 'quarterly' && (
                <Text style={styles.periodRange}>
                  {format(period.startDate, 'MMM d')} - {format(period.endDate, 'MMM d, yyyy')}
                </Text>
              )}
            </View>
          );
        })}
      </ScrollView>

      <Modal
        visible={showCurrencyPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCurrencyPicker(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowCurrencyPicker(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Currency</Text>
            {SUPPORTED_CURRENCIES.map(currency => (
              <TouchableOpacity
                key={currency.code}
                style={[
                  styles.currencyItem,
                  selectedCurrency === currency.code && styles.currencyItemSelected
                ]}
                onPress={() => {
                  setSelectedCurrency(currency.code);
                  setShowCurrencyPicker(false);
                }}
              >
                <Text style={styles.currencySymbol}>{currency.symbol}</Text>
                <View style={styles.currencyInfo}>
                  <Text style={styles.currencyName}>{currency.name}</Text>
                  <Text style={styles.currencyCode}>{currency.code}</Text>
                </View>
                {selectedCurrency === currency.code && (
                  <View style={styles.selectedIndicator} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
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
    flex: 1,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.xl,
    color: COLORS.neutral[900],
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.neutral[100],
    paddingHorizontal: SPACING[2],
    paddingVertical: SPACING[1],
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING[1],
  },
  currencyText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: COLORS.neutral[700],
  },
  content: {
    flex: 1,
    padding: SPACING[4],
  },
  periodSection: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING[4],
    marginBottom: SPACING[4],
  },
  periodTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.lg,
    color: COLORS.neutral[900],
    marginBottom: SPACING[4],
  },
  chartContainer: {
    alignItems: 'center',
    gap: SPACING[4],
  },
  donutChart: {
    width: CHART_SIZE,
    height: CHART_SIZE,
  },
  donutCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -CHART_SIZE / 4 }, { translateY: -CHART_SIZE / 4 }],
    width: CHART_SIZE / 2,
    height: CHART_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalAmount: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES['2xl'],
    color: COLORS.neutral[900],
    marginBottom: SPACING[1],
    textAlign: 'center',
  },
  totalLabel: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: COLORS.neutral[500],
    textAlign: 'center',
  },
  categoriesCard: {
    width: '100%',
    backgroundColor: COLORS.background.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING[3],
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
    gap: SPACING[2],
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
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
  periodRange: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.neutral[600],
    textAlign: 'center',
    marginTop: SPACING[2],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: SPACING[4],
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING[2],
  },
  modalTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.lg,
    color: COLORS.neutral[900],
    padding: SPACING[3],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING[3],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  currencyItemSelected: {
    backgroundColor: COLORS.primary[50],
  },
  currencySymbol: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.xl,
    color: COLORS.neutral[900],
    width: 40,
    textAlign: 'center',
  },
  currencyInfo: {
    flex: 1,
    marginLeft: SPACING[2],
  },
  currencyName: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.base,
    color: COLORS.neutral[900],
  },
  currencyCode: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.neutral[500],
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary[500],
  },
});