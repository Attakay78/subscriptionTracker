import React, { useState } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, User } from 'lucide-react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';

export function SignupForm() {
  const router = useRouter();
  const { signUp } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: '',
  });

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      general: '',
    };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await signUp(email, password, name);
      router.replace('/');
    } catch (error) {
      console.error('Signup error:', error);
      setErrors(prev => ({
        ...prev,
        general: 'Failed to create account. Please try again.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to track your subscriptions</Text>

        {errors.general ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errors.general}</Text>
          </View>
        ) : null}

        <Input
          label="Full Name"
          placeholder="John Doe"
          value={name}
          onChangeText={setName}
          error={errors.name}
          icon={<User size={20} color={COLORS.neutral[500]} />}
        />

        <Input
          label="Email"
          placeholder="your@email.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          error={errors.email}
          icon={<Mail size={20} color={COLORS.neutral[500]} />}
        />

        <Input
          label="Password"
          placeholder="Your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={errors.password}
          icon={<Lock size={20} color={COLORS.neutral[500]} />}
        />

        <Input
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          error={errors.confirmPassword}
          icon={<Lock size={20} color={COLORS.neutral[500]} />}
        />

        <Button
          title="Create Account"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
          fullWidth
          style={styles.button}
        />

        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>Already have an account? </Text>
          <Text
            style={styles.link}
            onPress={() => router.push('/login')}
          >
            Sign in
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  formContainer: {
    padding: SPACING[4],
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES['3xl'],
    color: COLORS.neutral[900],
    marginBottom: SPACING[1],
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.lg,
    color: COLORS.neutral[600],
    marginBottom: SPACING[4],
  },
  errorContainer: {
    backgroundColor: COLORS.error[50],
    borderRadius: 8,
    padding: SPACING[2],
    marginBottom: SPACING[3],
    borderWidth: 1,
    borderColor: COLORS.error[100],
  },
  errorText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.error[700],
  },
  button: {
    marginTop: SPACING[2],
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING[4],
  },
  linkText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.base,
    color: COLORS.neutral[600],
  },
  link: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.base,
    color: COLORS.primary[600],
  },
});