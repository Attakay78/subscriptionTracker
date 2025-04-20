import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useSubscriptions } from '@/context/SubscriptionContext';

const PLATFORM_CATEGORIES = [
  'Entertainment',
  'Music',
  'News',
  'Sports',
  'Gaming',
  'Productivity',
  'Education',
  'Shopping',
  'Health & Fitness',
  'Other'
];

interface FormState {
  name: string;
  category: string;
  errors: {
    name: string;
    category: string;
  };
}

function generateRandomColor(): string {
  const colors = [
    COLORS.primary[500],
    COLORS.secondary[500],
    COLORS.accent[500],
    COLORS.success[500],
    COLORS.error[500],
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function generatePlaceholderImage(name: string): string {
  return `https://placehold.co/100x100/2563eb/ffffff/png?text=${encodeURIComponent(name.charAt(0).toUpperCase())}`;
}

export default function CustomPlatformScreen() {
  const router = useRouter();
  const { addCustomPlatform } = useSubscriptions();
  const [formState, setFormState] = useState<FormState>({
    name: '',
    category: '',
    errors: {
      name: '',
      category: '',
    },
  });

  const handleSubmit = async () => {
    const errors = {
      name: '',
      category: '',
    };
    let isValid = true;

    if (!formState.name?.trim()) {
      errors.name = 'Platform name is required';
      isValid = false;
    }

    if (!formState.category) {
      errors.category = 'Category is required';
      isValid = false;
    }

    if (!isValid) {
      setFormState(prev => ({
        ...prev,
        errors,
      }));
      return;
    }

    const color = generateRandomColor();
    const customPlatform = {
      id: `custom-${Date.now()}`,
      name: formState.name.trim(),
      logo: generatePlaceholderImage(formState.name.trim()),
      category: formState.category,
      color,
      isCustom: true,
    };

    try {
      await addCustomPlatform(customPlatform);
      router.back();
      // Use a timeout to ensure the modal is closed before updating the parent screen
      setTimeout(() => {
        router.setParams({ customPlatform: JSON.stringify(customPlatform) });
      }, 100);
    } catch (error) {
      console.error('Failed to add custom platform:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.neutral[800]} />
        </TouchableOpacity>
        <Text style={styles.title}>Add Custom Platform</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formSection}>
          <Input
            label="Platform Name"
            placeholder="Enter platform name"
            value={formState.name}
            onChangeText={(text) => setFormState(prev => ({
              ...prev,
              name: text,
              errors: {
                ...prev.errors,
                name: '',
              },
            }))}
            error={formState.errors.name}
          />

          <View style={styles.categoryContainer}>
            <Text style={styles.categoryLabel}>Category</Text>
            <ScrollView style={styles.categoryList}>
              {PLATFORM_CATEGORIES.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryItem,
                    formState.category === category && styles.categoryItemSelected,
                  ]}
                  onPress={() => setFormState(prev => ({
                    ...prev,
                    category,
                    errors: {
                      ...prev.errors,
                      category: '',
                    },
                  }))}
                >
                  <Text style={[
                    styles.categoryItemText,
                    formState.category === category && styles.categoryItemTextSelected,
                  ]}>
                    {category}
                  </Text>
                  {formState.category === category && (
                    <View style={styles.selectedIndicator} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {formState.errors.category ? (
            <Text style={styles.errorText}>{formState.errors.category}</Text>
          ) : null}
        </View>

        <Button
          title="Add Platform"
          onPress={handleSubmit}
          style={styles.submitButton}
        />
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
  categoryContainer: {
    marginTop: SPACING[3],
  },
  categoryLabel: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: COLORS.neutral[700],
    marginBottom: SPACING[2],
  },
  categoryList: {
    maxHeight: 300,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING[3],
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING[2],
  },
  categoryItemSelected: {
    backgroundColor: COLORS.primary[50],
    borderColor: COLORS.primary[500],
  },
  categoryItemText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.base,
    color: COLORS.neutral[900],
  },
  categoryItemTextSelected: {
    color: COLORS.primary[700],
    fontFamily: FONTS.medium,
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary[500],
  },
  errorText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.error[500],
    marginTop: SPACING[1],
  },
  submitButton: {
    margin: SPACING[3],
  },
});