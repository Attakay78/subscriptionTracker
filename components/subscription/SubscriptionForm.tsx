import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  TextInput,
  Image,
  Keyboard,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { format } from 'date-fns';
import { Calendar, ArrowLeft, ChevronDown, Search, X, Plus } from 'lucide-react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { subscriptionPlatforms, billingCycles, SUPPORTED_CURRENCIES, getCurrencySymbol } from '@/data/subscriptionPlatforms';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { useAuth } from '@/context/AuthContext';

interface FormState {
  platformSearch: string;
  selectedPlatform: any;
  price: string;
  currency: string;
  billingCycle: string;
  startDate: Date;
  showPlatformList: boolean;
  showDatePicker: boolean;
  showCurrencyPicker: boolean;
  errors: {
    platform: string;
    price: string;
  };
}

const initialFormState: FormState = {
  platformSearch: '',
  selectedPlatform: null,
  price: '',
  currency: 'USD',
  billingCycle: billingCycles[1].value,
  startDate: new Date(),
  showPlatformList: false,
  showDatePicker: false,
  showCurrencyPicker: false,
  errors: {
    platform: '',
    price: '',
  },
};

export function SubscriptionForm() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const { addSubscription, customPlatforms } = useSubscriptions();
  
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [isAdding, setIsAdding] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (params.customPlatform) {
      try {
        const platform = JSON.parse(params.customPlatform as string);
        setFormState(prev => ({
          ...prev,
          selectedPlatform: platform,
          platformSearch: platform.name,
        }));
      } catch (error) {
        console.error('Failed to parse custom platform:', error);
      }
    }
  }, [params.customPlatform]);

  const allPlatforms = [...subscriptionPlatforms, ...customPlatforms];
  
  const filteredPlatforms = formState.platformSearch.trim() 
    ? allPlatforms.filter(p => 
        p.name.toLowerCase().includes(formState.platformSearch.toLowerCase())
      )
    : allPlatforms;

  const handleSelectPlatform = (platform: any) => {
    if (!platform) return;
    
    setFormState(prev => ({
      ...prev,
      selectedPlatform: platform,
      platformSearch: platform.name,
      showPlatformList: false,
      errors: { ...prev.errors, platform: '' },
    }));
  };

  const handleSubmit = async () => {
    let isValid = true;
    const newErrors = { platform: '', price: '' };

    if (!formState.selectedPlatform) {
      newErrors.platform = 'Please select a platform or create a custom one';
      isValid = false;
    }

    const priceValue = parseFloat(formState.price);
    if (isNaN(priceValue) || priceValue <= 0) {
      newErrors.price = 'Please enter a valid price';
      isValid = false;
    }

    setFormState(prev => ({ ...prev, errors: newErrors }));

    if (!isValid || !user || !formState.selectedPlatform) return;

    try {
      setIsAdding(true);
      
      await addSubscription({
        userId: user.id,
        platformId: formState.selectedPlatform.id,
        platformName: formState.selectedPlatform.name,
        platformLogo: formState.selectedPlatform.logo,
        color: formState.selectedPlatform.color,
        price: parseFloat(formState.price),
        currency: formState.currency,
        startDate: formState.startDate.toISOString(),
        billingCycle: formState.billingCycle,
        category: formState.selectedPlatform.category,
      });

      router.replace('/(tabs)');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to add subscription.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setFormState(prev => ({ ...prev, startDate: selectedDate }));
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.neutral[800]} />
        </TouchableOpacity>
        <Text style={styles.title}>Add Subscription</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Platform</Text>
            <TouchableOpacity
              style={styles.addCustomButton}
              onPress={() => router.push('/add/custom')}
            >
              <Plus size={16} color={COLORS.primary[500]} />
              <Text style={styles.addCustomButtonText}>Add Custom</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.platformSelector,
              formState.selectedPlatform && styles.platformSelectorSelected
            ]}
            onPress={() => setFormState(prev => ({ ...prev, showPlatformList: true }))}
          >
            {formState.selectedPlatform ? (
              <View style={styles.selectedPlatform}>
                <Image
                  source={{ uri: formState.selectedPlatform.logo }}
                  style={styles.selectedPlatformLogo}
                />
                <View style={styles.selectedPlatformInfo}>
                  <Text style={styles.selectedPlatformName}>
                    {formState.selectedPlatform.name}
                  </Text>
                  <Text style={styles.selectedPlatformCategory}>
                    {formState.selectedPlatform.category}
                    {formState.selectedPlatform.isCustom && ' • Custom'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    setFormState(prev => ({
                      ...prev,
                      selectedPlatform: null,
                      platformSearch: '',
                    }));
                  }}
                  style={styles.clearButton}
                >
                  <X size={16} color={COLORS.neutral[500]} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.platformSelectorContent}>
                <Search size={20} color={COLORS.neutral[500]} />
                <Text style={styles.platformSelectorText}>
                  Search for a platform
                </Text>
                <ChevronDown size={20} color={COLORS.neutral[500]} />
              </View>
            )}
          </TouchableOpacity>

          {formState.errors.platform ? (
            <Text style={styles.errorText}>{formState.errors.platform}</Text>
          ) : null}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Price & Billing</Text>
          
          <View style={styles.row}>
            <View style={styles.priceContainer}>
              <TouchableOpacity
                style={styles.currencySelector}
                onPress={() => setFormState(prev => ({ ...prev, showCurrencyPicker: true }))}
              >
                <Text style={styles.currencySymbol}>
                  {getCurrencySymbol(formState.currency)}
                </Text>
                <ChevronDown size={16} color={COLORS.neutral[500]} />
              </TouchableOpacity>

              <TextInput
                style={styles.priceInput}
                value={formState.price}
                onChangeText={(text) => setFormState(prev => ({ ...prev, price: text }))}
                placeholder="0.00"
                keyboardType="decimal-pad"
                placeholderTextColor={COLORS.neutral[400]}
              />
            </View>

            <TouchableOpacity
              style={styles.dateSelector}
              onPress={() => setFormState(prev => ({ ...prev, showDatePicker: Platform.OS === 'ios' }))}
            >
              <Calendar size={20} color={COLORS.neutral[500]} />
              <Text style={styles.dateText}>
                {format(formState.startDate, 'MMM d, yyyy')}
              </Text>
              <ChevronDown size={16} color={COLORS.neutral[500]} />
            </TouchableOpacity>
          </View>

          {formState.errors.price ? (
            <Text style={styles.errorText}>{formState.errors.price}</Text>
          ) : null}

          <View style={styles.billingCycleContainer}>
            {billingCycles.map(cycle => (
              <TouchableOpacity
                key={cycle.value}
                style={[
                  styles.billingCycleButton,
                  formState.billingCycle === cycle.value && styles.billingCycleButtonActive,
                ]}
                onPress={() => setFormState(prev => ({ ...prev, billingCycle: cycle.value }))}
              >
                <Text
                  style={[
                    styles.billingCycleText,
                    formState.billingCycle === cycle.value && styles.billingCycleTextActive,
                  ]}
                  numberOfLines={1}
                >
                  {cycle.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button
          title="Add Subscription"
          onPress={handleSubmit}
          loading={isAdding}
          disabled={isAdding}
          style={styles.submitButton}
          size="sm"
        />
      </ScrollView>

      <Modal
        visible={formState.showPlatformList}
        transparent
        animationType="fade"
        onRequestClose={() => setFormState(prev => ({ ...prev, showPlatformList: false }))}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalContainer}
        >
          <Pressable 
            style={[
              styles.modalOverlay,
              keyboardVisible && styles.modalOverlayWithKeyboard
            ]}
            onPress={() => setFormState(prev => ({ ...prev, showPlatformList: false }))}
          >
            <View style={[
              styles.modalContent,
              keyboardVisible && styles.modalContentWithKeyboard
            ]}>
              <View style={styles.searchContainer}>
                <Search size={20} color={COLORS.neutral[500]} />
                <TextInput
                  style={styles.searchInput}
                  value={formState.platformSearch}
                  onChangeText={(text) => setFormState(prev => ({ ...prev, platformSearch: text }))}
                  placeholder="Search platforms..."
                  autoFocus
                />
              </View>

              <ScrollView style={styles.platformList}>
                {filteredPlatforms.map(platform => (
                  <TouchableOpacity
                    key={platform.id}
                    style={styles.platformItem}
                    onPress={() => handleSelectPlatform(platform)}
                  >
                    <Image
                      source={{ uri: platform.logo }}
                      style={styles.platformLogo}
                    />
                    <View style={styles.platformInfo}>
                      <Text style={styles.platformName}>{platform.name}</Text>
                      <Text style={styles.platformCategory}>
                        {platform.category}
                        {platform.isCustom && ' • Custom'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={formState.showCurrencyPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setFormState(prev => ({ ...prev, showCurrencyPicker: false }))}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setFormState(prev => ({ ...prev, showCurrencyPicker: false }))}
        >
          <View style={styles.currencyModalContent}>
            <Text style={styles.modalTitle}>Select Currency</Text>
            {SUPPORTED_CURRENCIES.map(currency => (
              <TouchableOpacity
                key={currency.code}
                style={[
                  styles.currencyItem,
                  formState.currency === currency.code && styles.currencyItemSelected
                ]}
                onPress={() => {
                  setFormState(prev => ({
                    ...prev,
                    currency: currency.code,
                    showCurrencyPicker: false,
                  }));
                }}
              >
                <Text style={styles.currencySymbolLarge}>{currency.symbol}</Text>
                <View style={styles.currencyInfo}>
                  <Text style={styles.currencyName}>{currency.name}</Text>
                  <Text style={styles.currencyCode}>{currency.code}</Text>
                </View>
                {formState.currency === currency.code && (
                  <View style={styles.selectedIndicator} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      {Platform.OS === 'ios' ? (
        <Modal
          visible={formState.showDatePicker}
          transparent
          animationType="slide"
        >
          <Pressable 
            style={styles.modalOverlay}
            onPress={() => setFormState(prev => ({ ...prev, showDatePicker: false }))}
          >
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerHeader}>
                <TouchableOpacity
                  onPress={() => setFormState(prev => ({ ...prev, showDatePicker: false }))}
                >
                  <Text style={styles.datePickerButton}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.datePickerTitle}>Select Date</Text>
                <TouchableOpacity
                  onPress={() => setFormState(prev => ({ ...prev, showDatePicker: false }))}
                >
                  <Text style={[styles.datePickerButton, styles.datePickerButtonConfirm]}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={formState.startDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                style={styles.datePicker}
                textColor={COLORS.neutral[900]}
              />
            </View>
          </Pressable>
        </Modal>
      ) : (
        formState.showDatePicker && (
          <DateTimePicker
            value={formState.startDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setFormState(prev => ({
                ...prev,
                showDatePicker: false,
                startDate: selectedDate || prev.startDate,
              }));
            }}
          />
        )
      )}
    </KeyboardAvoidingView>
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
    padding: SPACING[3],
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  backButton: {
    marginRight: SPACING[2],
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.xl,
    color: COLORS.neutral[900],
  },
  content: {
    flex: 1,
  },
  formSection: {
    backgroundColor: COLORS.white,
    marginTop: SPACING[2],
    padding: SPACING[3],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING[2],
  },
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.base,
    color: COLORS.neutral[800],
  },
  addCustomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING[2],
    paddingVertical: SPACING[1],
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primary[50],
    gap: SPACING[1],
  },
  addCustomButtonText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary[600],
  },
  platformSelector: {
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
  },
  platformSelectorSelected: {
    borderColor: COLORS.primary[500],
    backgroundColor: COLORS.primary[50],
  },
  platformSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING[2],
    gap: SPACING[2],
  },
  platformSelectorText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.base,
    color: COLORS.neutral[500],
  },
  selectedPlatform: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING[2],
  },
  selectedPlatformLogo: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.md,
  },
  selectedPlatformInfo: {
    flex: 1,
    marginLeft: SPACING[2],
  },
  selectedPlatformName: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.base,
    color: COLORS.neutral[900],
  },
  selectedPlatformCategory: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.neutral[500],
  },
  clearButton: {
    padding: SPACING[1],
  },
  errorText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.error[500],
    marginTop: SPACING[1],
  },
  row: {
    flexDirection: 'row',
    gap: SPACING[2],
    marginBottom: SPACING[2],
  },
  priceContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING[2],
    paddingVertical: SPACING[1],
    borderRightWidth: 1,
    borderRightColor: COLORS.neutral[200],
    gap: SPACING[1],
  },
  currencySymbol: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.lg,
    color: COLORS.neutral[900],
  },
  priceInput: {
    flex: 1,
    paddingHorizontal: SPACING[2],
    paddingVertical: SPACING[1],
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.lg,
    color: COLORS.neutral[900],
  },
  dateSelector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING[2],
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.white,
    gap: SPACING[1],
  },
  dateText: {
    flex: 1,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: COLORS.neutral[900],
  },
  billingCycleContainer: {
    flexDirection: 'row',
    gap: SPACING[1],
    marginTop: SPACING[2],
  },
  billingCycleButton: {
    flex: 1,
    paddingVertical: SPACING[1],
    paddingHorizontal: SPACING[1],
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.neutral[100],
    alignItems: 'center',
    minWidth: '23%',
    maxWidth: '25%',
  },
  billingCycleButtonActive: {
    backgroundColor: COLORS.primary[500],
  },
  billingCycleText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: COLORS.neutral[700],
  },
  billingCycleTextActive: {
    color: COLORS.white,
  },
  submitButton: {
    margin: SPACING[3],
    paddingVertical: SPACING[1.5],
  },
  modalContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: SPACING[4],
  },
  modalOverlayWithKeyboard: {
    justifyContent: 'flex-start',
    paddingTop: '20%',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    maxHeight: '80%',
  },
  modalContentWithKeyboard: {
    maxHeight: '60%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING[3],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
    gap: SPACING[2],
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.base,
    color: COLORS.neutral[900],
  },
  platformList: {
    maxHeight: 400,
  },
  platformItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING[3],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  platformLogo: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
  },
  platformInfo: {
    flex: 1,
    marginLeft: SPACING[2],
  },
  platformName: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.base,
    color: COLORS.neutral[900],
  },
  platformCategory: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.neutral[500],
  },
  modalTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.lg,
    color: COLORS.neutral[900],
    padding: SPACING[3],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  currencyModalContent: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING[2],
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
  currencySymbolLarge: {
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
  datePickerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    paddingBottom: Platform.OS === 'ios' ? 34 : SPACING[4],
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING[3],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  datePickerTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.lg,
    color: COLORS.neutral[900],
  },
  datePickerButton: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.base,
    color: COLORS.neutral[600],
  },
  datePickerButtonConfirm: {
    color: COLORS.primary[500],
  },
  datePicker: {
    height: 200,
    backgroundColor: COLORS.white,
  },
});