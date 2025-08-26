import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';

export default function TestPage() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>App is Working!</Text>
        <Text style={styles.subtitle}>
          If you can see this, the basic app structure is functioning correctly.
        </Text>
        <Text style={styles.info}>
          Environment: {process.env.NODE_ENV || 'development'}
        </Text>
        <Text style={styles.info}>
          Platform: {typeof window !== 'undefined' ? 'web' : 'native'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  info: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 8,
  },
});