import { StyleSheet, SafeAreaView } from 'react-native';
import { COLORS } from '@/constants/theme';
import { SignupForm } from '@/components/auth/SignupForm';

export default function SignupScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <SignupForm />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
});