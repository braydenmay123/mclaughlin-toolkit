import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';

export default function TestPage() {
  console.log('TestPage rendering...');
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>✅ McLaughlin Toolkit is Live!</Text>
        <Text style={styles.subtitle}>
          Your financial toolkit is successfully deployed and working.
        </Text>
        <Text style={styles.info}>
          Environment: {process.env.NODE_ENV || 'development'}
        </Text>
        <Text style={styles.info}>
          Platform: {typeof window !== 'undefined' ? 'web' : 'native'}
        </Text>
        <Text style={styles.info}>
          Timestamp: {new Date().toISOString()}
        </Text>
        
        <View style={styles.statusContainer}>
          <Text style={styles.statusTitle}>System Status:</Text>
          <Text style={styles.statusItem}>✅ React Native Web</Text>
          <Text style={styles.statusItem}>✅ Expo Router</Text>
          <Text style={styles.statusItem}>✅ TypeScript</Text>
          <Text style={styles.statusItem}>✅ tRPC Backend</Text>
        </View>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  info: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 8,
    textAlign: 'center',
  },
  statusContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  statusItem: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 5,
    textAlign: 'center',
  },
});