import { StyleSheet, SafeAreaView } from 'react-native';
import { COLORS } from '@/constants/theme';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LoginForm />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
});