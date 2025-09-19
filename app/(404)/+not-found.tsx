import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <View style={s.wrap} testID="not-found-screen">
      <View style={s.card}>
        <Text accessibilityRole="header" style={s.h1}>Page not found</Text>
        <Text style={s.p}>The page you’re looking for doesn’t exist or has moved.</Text>
        <Link href="/" asChild>
          <Pressable
            testID="go-home-button"
            accessibilityRole="button"
            style={s.btn}
          >
            <Text style={s.btnText}>Go Home</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: 'white' },
  card: { maxWidth: 560 },
  h1: { fontSize: 24, fontWeight: '700', color: '#04233a', marginBottom: 8 },
  p: { color: '#04233a', opacity: 0.85, marginBottom: 16 },
  btn: { borderColor: '#04233a', borderWidth: 1, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 14, alignSelf: 'center' },
  btnText: { color: '#04233a', fontWeight: '600' },
});
