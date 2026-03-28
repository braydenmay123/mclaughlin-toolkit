import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { getGateStatus } from '@/utils/gateStorage';
import GateModal from '@/components/GateModal';
import Colors from '@/constants/colors';

export default function CalculatorsGate() {
  const router = useRouter();
  const [showGate, setShowGate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkGateStatus();
  }, []);

  const checkGateStatus = async () => {
    try {
      const gateData = await getGateStatus();
      if (gateData?.passed) {
        // Gate already passed, redirect to calculators
        router.replace('/calculators');
      } else {
        // Show gate modal
        setShowGate(true);
      }
    } catch (error) {
      console.error('Error checking gate status:', error);
      setShowGate(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGateSuccess = () => {
    setShowGate(false);
    router.replace('/calculators');
  };

  const handleGateClose = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GateModal
        visible={showGate}
        onSuccess={handleGateSuccess}
        onClose={handleGateClose}
        pageSource="calculators"
        title="Access Financial Calculators"
        subtitle="Please provide your contact information to access our comprehensive suite of financial calculators."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});