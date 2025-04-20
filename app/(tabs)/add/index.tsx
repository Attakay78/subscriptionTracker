import { StyleSheet, SafeAreaView } from 'react-native';
import { COLORS } from '@/constants/theme';
import { SubscriptionForm } from '@/components/subscription/SubscriptionForm';

export default function AddSubscriptionScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <SubscriptionForm />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
});